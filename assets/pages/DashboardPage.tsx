import React, { useState } from 'react';
import styled from 'styled-components';
import { MainLayout } from '../components/layout/MainLayout';
import { NoteList } from '../components/notes/NoteList';
import { NoteFilters } from '../components/notes/NoteFilters';
import { NoteForm } from '../components/notes/NoteForm';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { useNotes } from '../hooks/useNotes';
import { useCategories } from '../hooks/useCategories';
import { Note, NoteFilters as FilterType, CreateNoteData, UpdateNoteData } from '../types/note';

const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PageTitle = styled.h1`
    margin: 0;
`;

export const DashboardPage: React.FC = () => {
    const [filters, setFilters] = useState<FilterType>({ search: '', status: '', categoryId: '' });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);

    const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes(filters);
    const { categories } = useCategories();

    const handleCreateNote = async (data: CreateNoteData) => {
        await createNote(data);
    };

    const handleUpdateNote = async (data: UpdateNoteData) => {
        if (editingNote) {
            await updateNote(editingNote.id, data);
        }
    };

    const handleDeleteNote = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            await deleteNote(id);
        }
    };

    const handleEditNote = (note: Note) => {
        setEditingNote(note);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingNote(null);
    };

    return (
        <MainLayout>
            <PageHeader>
                <PageTitle>My Notes</PageTitle>
                <Button onClick={() => setIsFormOpen(true)}>+ New Note</Button>
            </PageHeader>

            <NoteFilters filters={filters} onFilterChange={setFilters} categories={categories} />

            <NoteList notes={notes} isLoading={isLoading} onEdit={handleEditNote} onDelete={handleDeleteNote} />

            <Modal isOpen={isFormOpen} onClose={handleCloseForm} title={editingNote ? 'Edit Note' : 'Create Note'}>
                <NoteForm
                    note={editingNote}
                    categories={categories}
                    onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
                    onClose={handleCloseForm}
                />
            </Modal>
        </MainLayout>
    );
};
