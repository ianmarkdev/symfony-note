<?php

declare(strict_types=1);

namespace App\Enum;

enum NoteStatus: string
{
    case NEW = 'new';
    case TODO = 'todo';
    case DONE = 'done';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function isValid(string $status): bool
    {
        return in_array($status, self::values(), true);
    }
}
