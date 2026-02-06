<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\User;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class EmailConfirmationService
{
    private string $emailDir;
    private UrlGeneratorInterface $urlGenerator;

    public function __construct(string $projectDir, UrlGeneratorInterface $urlGenerator)
    {
        $this->emailDir = $projectDir . '/var/emails';
        $this->urlGenerator = $urlGenerator;
    }

    public function sendConfirmationEmail(User $user): void
    {
        if (!is_dir($this->emailDir)) {
            mkdir($this->emailDir, 0755, true);
        }

        $confirmUrl = $this->urlGenerator->generate(
            'api_auth_confirm',
            ['token' => $user->getConfirmationToken()],
            UrlGeneratorInterface::ABSOLUTE_URL
        );

        $content = $this->renderEmail($user->getEmail(), $confirmUrl);

        $filename = sprintf(
            '%s/%s_%s.html',
            $this->emailDir,
            (new \DateTime())->format('Y-m-d_H-i-s'),
            str_replace(['@', '.'], '_', $user->getEmail())
        );

        file_put_contents($filename, $content);
    }

    private function renderEmail(string $email, string $confirmUrl): string
    {
        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Confirm Your Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background: #f9f9f9;
            border-radius: 8px;
            padding: 30px;
            border: 1px solid #ddd;
        }
        h1 {
            color: #4A90D9;
        }
        .button {
            display: inline-block;
            background: #4A90D9;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
        }
        .url {
            word-break: break-all;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Notes App!</h1>
        <p>Hello <strong>{$email}</strong>,</p>
        <p>Thank you for registering. Please confirm your email address by clicking the button below:</p>
        <p>
            <a href="{$confirmUrl}" class="button">Confirm Email</a>
        </p>
        <p>Or copy and paste this URL into your browser:</p>
        <p class="url">{$confirmUrl}</p>
        <p>If you did not create an account, please ignore this email.</p>
    </div>
</body>
</html>
HTML;
    }
}
