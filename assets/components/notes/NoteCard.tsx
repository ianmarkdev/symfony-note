import React from 'react';
import styled from 'styled-components';
import { Note } from '../../types/note';
import { Button } from '../common/Button';

interface NoteCardProps {
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (id: number) => void;
}

const Card = styled.div`
    background: #FFFFFF;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 100%;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
`;

const Title = styled.h3`
    font-size: 18px;
    margin: 0;
    flex: 1;
`;

const StatusBadge = styled.span<{ $status: string }>`
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    text-transform: capitalize;
    background-color: ${({ $status }) => {
        switch ($status) {
            case 'new':
                return '#4A90D9';
            case 'todo':
                return '#FFC107';
            case 'done':
                return '#28A745';
            default:
                return '#6C757D';
        }
    }};
    color: ${({ $status }) => ($status === 'todo' ? '#333' : 'white')};
`;

const ContentWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Content = styled.p`
    color: #666666;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const CategoryBadge = styled.span<{ $color?: string | null }>`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background-color: ${({ $color }) => $color ? `${$color}20` : '#6C757D20'};
    border: 1px solid ${({ $color }) => $color || '#6C757D'};
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    color: ${({ $color }) => $color || '#6C757D'};
    width: fit-content;

    &::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: ${({ $color }) => $color || '#6C757D'};
    }
`;

const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid #E0E0E0;
`;

const DateText = styled.span`
    font-size: 12px;
    color: #999999;
`;

const Actions = styled.div`
    display: flex;
    gap: 4px;
`;

export const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
    return (
        <Card>
            <Header>
                <Title>{note.title}</Title>
                <StatusBadge $status={note.status}>{note.status}</StatusBadge>
            </Header>
            <ContentWrapper>
                <Content>{note.content}</Content>
                {note.category && <CategoryBadge $color={note.category.color}>{note.category.name}</CategoryBadge>}
            </ContentWrapper>
            <Footer>
                <DateText>Updated: {new Date(note.updatedAt).toLocaleDateString()}</DateText>
                <Actions>
                    <Button size="sm" variant="secondary" onClick={() => onEdit(note)}>
                        Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => onDelete(note.id)}>
                        Delete
                    </Button>
                </Actions>
            </Footer>
        </Card>
    );
};
