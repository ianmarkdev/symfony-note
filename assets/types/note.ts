import { Category } from './category';

export type NoteStatus = 'new' | 'todo' | 'done';

export interface Note {
    id: number;
    title: string;
    content: string;
    status: NoteStatus;
    category: Category | null;
    createdAt: string;
    updatedAt: string;
}

export interface NoteFilters {
    search: string;
    status: string;
    categoryId: string;
}

export interface CreateNoteData {
    title: string;
    content: string;
    status?: NoteStatus;
    categoryId?: number | null;
}

export interface UpdateNoteData {
    title?: string;
    content?: string;
    status?: NoteStatus;
    categoryId?: number | null;
}
