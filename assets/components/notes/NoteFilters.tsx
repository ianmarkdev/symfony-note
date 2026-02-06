import React from 'react';
import styled from 'styled-components';
import { Category } from '../../types/category';
import { NoteFilters as FilterType } from '../../types/note';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

interface NoteFiltersProps {
    filters: FilterType;
    onFilterChange: (filters: FilterType) => void;
    categories: Category[];
}

const FiltersContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.card};
    border-radius: ${({ theme }) => theme.borderRadius};
    box-shadow: ${({ theme }) => theme.boxShadow};
`;

const FilterItem = styled.div`
    flex: 1;
    min-width: 200px;
`;

const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'todo', label: 'Todo' },
    { value: 'done', label: 'Done' },
];

export const NoteFilters: React.FC<NoteFiltersProps> = ({ filters, onFilterChange, categories }) => {
    const categoryOptions = categories.map((cat) => ({
        value: cat.id.toString(),
        label: cat.name,
    }));

    return (
        <FiltersContainer>
            <FilterItem>
                <Input
                    placeholder="Search notes..."
                    value={filters.search}
                    onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                />
            </FilterItem>
            <FilterItem>
                <Select
                    placeholder="All statuses"
                    options={statusOptions}
                    value={filters.status}
                    onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
                />
            </FilterItem>
            <FilterItem>
                <Select
                    placeholder="All categories"
                    options={categoryOptions}
                    value={filters.categoryId}
                    onChange={(e) => onFilterChange({ ...filters, categoryId: e.target.value })}
                />
            </FilterItem>
        </FiltersContainer>
    );
};
