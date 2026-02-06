<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\Category;
use App\Entity\User;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/categories')]
class CategoryController extends AbstractController
{
    #[Route('', name: 'api_categories_index', methods: ['GET'])]
    public function index(CategoryRepository $categoryRepository): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $categories = $categoryRepository->findByUser($user);

        return $this->json([
            'categories' => array_map(fn(Category $cat) => $this->serializeCategory($cat), $categories),
        ]);
    }

    #[Route('', name: 'api_categories_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name']) || empty(trim($data['name']))) {
            return $this->json(['error' => 'Category name is required.'], 400);
        }

        $category = new Category();
        $category->setName(trim($data['name']));
        $category->setUser($user);

        if (isset($data['color']) && preg_match('/^#[0-9A-Fa-f]{6}$/', $data['color'])) {
            $category->setColor($data['color']);
        }

        $entityManager->persist($category);
        $entityManager->flush();

        return $this->json([
            'category' => $this->serializeCategory($category),
        ], 201);
    }

    #[Route('/{id}', name: 'api_categories_update', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request,
        CategoryRepository $categoryRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();

        $category = $categoryRepository->find($id);

        if (!$category || $category->getUser() !== $user) {
            return $this->json(['error' => 'Category not found.'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['name']) && !empty(trim($data['name']))) {
            $category->setName(trim($data['name']));
        }

        if (isset($data['color'])) {
            if ($data['color'] && preg_match('/^#[0-9A-Fa-f]{6}$/', $data['color'])) {
                $category->setColor($data['color']);
            } else if (empty($data['color'])) {
                $category->setColor(null);
            }
        }

        $entityManager->flush();

        return $this->json([
            'category' => $this->serializeCategory($category),
        ]);
    }

    #[Route('/{id}', name: 'api_categories_delete', methods: ['DELETE'])]
    public function delete(
        int $id,
        CategoryRepository $categoryRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();

        $category = $categoryRepository->find($id);

        if (!$category || $category->getUser() !== $user) {
            return $this->json(['error' => 'Category not found.'], 404);
        }

        $entityManager->remove($category);
        $entityManager->flush();

        return $this->json(['message' => 'Category deleted successfully.']);
    }

    private function serializeCategory(Category $category): array
    {
        return [
            'id' => $category->getId(),
            'name' => $category->getName(),
            'color' => $category->getColor(),
        ];
    }
}
