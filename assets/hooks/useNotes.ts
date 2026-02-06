import { useState, useEffect, useCallback } from 'react';
import { Note, NoteFilters, CreateNoteData, UpdateNoteData } from '../types/note';
import * as notesApi from '../api/notes';

export const useNotes = (filters: NoteFilters) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotes = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await notesApi.getNotes(filters);
            setNotes(data);
            setError(null);
        } catch (err) {
            setError('Failed to load notes');
        } finally {
            setIsLoading(false);
        }
    }, [filters.search, filters.status, filters.categoryId]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const createNote = async (data: CreateNoteData): Promise<Note> => {
        const newNote = await notesApi.createNote(data);
        setNotes((prev) => [newNote, ...prev]);
        return newNote;
    };

    const updateNote = async (id: number, data: UpdateNoteData): Promise<Note> => {
        const updated = await notesApi.updateNote(id, data);
        setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
        return updated;
    };

    const deleteNote = async (id: number): Promise<void> => {
        await notesApi.deleteNote(id);
        setNotes((prev) => prev.filter((n) => n.id !== id));
    };

    return { notes, isLoading, error, createNote, updateNote, deleteNote, refetch: fetchNotes };
};
