<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\EmailConfirmationService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Uid\Uuid;

#[Route('/api/auth')]
class AuthController extends AbstractController
{
    #[Route('/register', name: 'api_auth_register', methods: ['POST'])]
    public function register(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager,
        UserRepository $userRepository,
        EmailConfirmationService $emailService
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email']) || !isset($data['password'])) {
            return $this->json(['error' => 'Email and password are required.'], 400);
        }

        $email = trim($data['email']);
        $password = $data['password'];

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->json(['error' => 'Invalid email format.'], 400);
        }

        if (strlen($password) < 6) {
            return $this->json(['error' => 'Password must be at least 6 characters.'], 400);
        }

        if ($userRepository->findByEmail($email)) {
            return $this->json(['error' => 'An account with this email already exists.'], 400);
        }

        $user = new User();
        $user->setEmail($email);
        $user->setPassword($passwordHasher->hashPassword($user, $password));
        $user->setConfirmationToken(Uuid::v4()->toRfc4122());

        $entityManager->persist($user);
        $entityManager->flush();

        $emailService->sendConfirmationEmail($user);

        return $this->json([
            'message' => 'Registration successful. Please check your email to confirm your account.',
        ], 201);
    }

    #[Route('/confirm/{token}', name: 'api_auth_confirm', methods: ['GET'])]
    public function confirm(
        string $token,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $user = $userRepository->findByConfirmationToken($token);

        if (!$user) {
            return $this->json(['error' => 'Invalid or expired confirmation token.'], 400);
        }

        $user->setIsVerified(true);
        $user->setConfirmationToken(null);

        $entityManager->flush();

        return $this->json([
            'message' => 'Email confirmed successfully. You can now log in.',
        ]);
    }

    #[Route('/login', name: 'api_auth_login', methods: ['POST'])]
    public function login(): JsonResponse
    {
        // This route is handled by the json_login authenticator
        // If we reach here, authentication failed
        return $this->json(['error' => 'Invalid credentials.'], 401);
    }

    #[Route('/me', name: 'api_auth_me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Not authenticated.'], 401);
        }

        return $this->json([
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
            ],
        ]);
    }

    #[Route('/logout', name: 'api_auth_logout', methods: ['POST'])]
    public function logout(): void
    {
        // This method is handled by Symfony's logout handler
        throw new \LogicException('This method should not be reached.');
    }
}
