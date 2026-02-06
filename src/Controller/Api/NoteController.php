<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\Note;
use App\Entity\User;
use App\Enum\NoteStatus;
use App\Repository\CategoryRepository;
use App\Repository\NoteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/notes')]
class NoteController extends AbstractController
{
    #[Route('', name: 'api_notes_index', methods: ['GET'])]
    public function index(Request $request, NoteRepository $noteRepository): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $search = $request->query->get('search');
        $status = $request->query->get('status');
        $categoryId = $request->query->get('category');

        $notes = $noteRepository->findByUserWithFilters(
            $user,
            $search,
            $status,
            $categoryId ? (int) $categoryId : null
        );

        return $this->json([
            'notes' => array_map(fn(Note $note) => $this->serializeNote($note), $notes),
        ]);
    }

    #[Route('', name: 'api_notes_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $entityManager,
        CategoryRepository $categoryRepository
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        if (!isset($data['title']) || !isset($data['content'])) {
            return $this->json(['error' => 'Title and content are required.'], 400);
        }

        $note = new Note();
        $note->setTitle(trim($data['title']));
        $note->setContent($data['content']);
        $note->setUser($user);

        if (isset($data['status']) && NoteStatus::isValid($data['status'])) {
            $note->setStatus($data['status']);
        }

        if (isset($data['categoryId']) && $data['categoryId']) {
            $category = $categoryRepository->find($data['categoryId']);
            if ($category && $category->getUser() === $user) {
                $note->setCategory($category);
            }
        }

        $entityManager->persist($note);
        $entityManager->flush();

        return $this->json([
            'note' => $this->serializeNote($note),
        ], 201);
    }

    #[Route('/{id}', name: 'api_notes_show', methods: ['GET'])]
    public function show(int $id, NoteRepository $noteRepository): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $note = $noteRepository->find($id);

        if (!$note || $note->getUser() !== $user) {
            return $this->json(['error' => 'Note not found.'], 404);
        }

        return $this->json([
            'note' => $this->serializeNote($note),
        ]);
    }

    #[Route('/{id}', name: 'api_notes_update', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request,
        NoteRepository $noteRepository,
        CategoryRepository $categoryRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();

        $note = $noteRepository->find($id);

        if (!$note || $note->getUser() !== $user) {
            return $this->json(['error' => 'Note not found.'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['title'])) {
            $note->setTitle(trim($data['title']));
        }

        if (isset($data['content'])) {
            $note->setContent($data['content']);
        }

        if (isset($data['status']) && NoteStatus::isValid($data['status'])) {
            $note->setStatus($data['status']);
        }

        if (array_key_exists('categoryId', $data)) {
            if ($data['categoryId']) {
                $category = $categoryRepository->find($data['categoryId']);
                if ($category && $category->getUser() === $user) {
                    $note->setCategory($category);
                }
            } else {
                $note->setCategory(null);
            }
        }

        $entityManager->flush();

        return $this->json([
            'note' => $this->serializeNote($note),
        ]);
    }

    #[Route('/{id}', name: 'api_notes_delete', methods: ['DELETE'])]
    public function delete(
        int $id,
        NoteRepository $noteRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();

        $note = $noteRepository->find($id);

        if (!$note || $note->getUser() !== $user) {
            return $this->json(['error' => 'Note not found.'], 404);
        }

        $entityManager->remove($note);
        $entityManager->flush();

        return $this->json(['message' => 'Note deleted successfully.']);
    }

    #[Route('/statuses', name: 'api_notes_statuses', methods: ['GET'])]
    public function statuses(): JsonResponse
    {
        return $this->json([
            'statuses' => NoteStatus::values(),
        ]);
    }

    private function serializeNote(Note $note): array
    {
        return [
            'id' => $note->getId(),
            'title' => $note->getTitle(),
            'content' => $note->getContent(),
            'status' => $note->getStatus(),
            'category' => $note->getCategory() ? [
                'id' => $note->getCategory()->getId(),
                'name' => $note->getCategory()->getName(),
                'color' => $note->getCategory()->getColor(),
            ] : null,
            'createdAt' => $note->getCreatedAt()->format('c'),
            'updatedAt' => $note->getUpdatedAt()->format('c'),
        ];
    }
}
