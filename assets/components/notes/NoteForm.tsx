import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Note, CreateNoteData, UpdateNoteData, NoteStatus } from '../../types/note';
import { Category } from '../../types/category';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

interface NoteFormProps {
    note?: Note | null;
    categories: Category[];
    onSubmit: (data: CreateNoteData | UpdateNoteData) => Promise<any>;
    onClose: () => void;
}

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

const TextArea = styled.textarea`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.inputBorder};
    border-radius: ${({ theme }) => theme.borderRadius};
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-family: inherit;
    outline: none;
    resize: vertical;
    min-height: 150px;
    transition: border-color ${({ theme }) => theme.transition};

    &:focus {
        border-color: ${({ theme }) => theme.colors.inputFocus};
        box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.inputFocus}33`};
    }
`;

const Label = styled.label`
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    justify-content: flex-end;
    margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ErrorMessage = styled.div`
    color: ${({ theme }) => theme.colors.danger};
    font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'todo', label: 'Todo' },
    { value: 'done', label: 'Done' },
];

export const NoteForm: React.FC<NoteFormProps> = ({ note, categories, onSubmit, onClose }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<NoteStatus>('new');
    const [categoryId, setCategoryId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
            setStatus(note.status);
            setCategoryId(note.category?.id.toString() || '');
        }
    }, [note]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        if (!content.trim()) {
            setError('Content is required');
            return;
        }

        setIsLoading(true);

        try {
            const data: CreateNoteData | UpdateNoteData = {
                title: title.trim(),
                content: content.trim(),
                status,
                categoryId: categoryId ? parseInt(categoryId) : null,
            };

            await onSubmit(data);
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save note');
        } finally {
            setIsLoading(false);
        }
    };

    const categoryOptions = categories.map((cat) => ({
        value: cat.id.toString(),
        label: cat.name,
    }));

    return (
        <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Input
                label="Title"
                placeholder="Enter note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <InputGroup>
                <Label>Content</Label>
                <TextArea
                    placeholder="Enter note content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </InputGroup>
            <Select
                label="Status"
                options={statusOptions}
                value={status}
                onChange={(e) => setStatus(e.target.value as NoteStatus)}
            />
            <Select
                label="Category"
                placeholder="No category"
                options={categoryOptions}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
            />
            <ButtonGroup>
                <Button type="button" variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : note ? 'Update' : 'Create'}
                </Button>
            </ButtonGroup>
        </Form>
    );
};
