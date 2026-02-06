import client from './client';
import { Note, NoteFilters, CreateNoteData, UpdateNoteData } from '../types/note';

interface NotesResponse {
    notes: Note[];
}

interface NoteResponse {
    note: Note;
}

interface StatusesResponse {
    statuses: string[];
}

export const getNotes = async (filters: NoteFilters): Promise<Note[]> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.categoryId) params.append('category', filters.categoryId);

    const response = await client.get<NotesResponse>(`/notes?${params}`);
    return response.data.notes;
};

export const getNote = async (id: number): Promise<Note> => {
    const response = await client.get<NoteResponse>(`/notes/${id}`);
    return response.data.note;
};

export const createNote = async (data: CreateNoteData): Promise<Note> => {
    const response = await client.post<NoteResponse>('/notes', data);
    return response.data.note;
};

export const updateNote = async (id: number, data: UpdateNoteData): Promise<Note> => {
    const response = await client.put<NoteResponse>(`/notes/${id}`, data);
    return response.data.note;
};

export const deleteNote = async (id: number): Promise<void> => {
    await client.delete(`/notes/${id}`);
};

export const getStatuses = async (): Promise<string[]> => {
    const response = await client.get<StatusesResponse>('/notes/statuses');
    return response.data.statuses;
};
