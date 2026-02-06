<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class IndexController extends AbstractController
{
    #[Route('/{reactRouting}', name: 'app_index', requirements: ['reactRouting' => '^(?!api).*'], defaults: ['reactRouting' => null], priority: -1)]
    public function index(): Response
    {
        return $this->render('index.html.twig');
    }
}
