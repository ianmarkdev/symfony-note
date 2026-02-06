import React from 'react';
import styled from 'styled-components';
import { Note } from '../../types/note';
import { NoteCard } from './NoteCard';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface NoteListProps {
    notes: Note[];
    isLoading: boolean;
    onEdit: (note: Note) => void;
    onDelete: (id: number) => void;
}

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
`;

const EmptyMessage = styled.div`
    text-align: center;
    padding: ${({ theme }) => theme.spacing.xxl};
    color: ${({ theme }) => theme.colors.textMuted};
`;

export const NoteList: React.FC<NoteListProps> = ({ notes, isLoading, onEdit, onDelete }) => {
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (notes.length === 0) {
        return <EmptyMessage>No notes found. Create your first note!</EmptyMessage>;
    }

    return (
        <Grid>
            {notes.map((note) => (
                <NoteCard key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </Grid>
    );
};
