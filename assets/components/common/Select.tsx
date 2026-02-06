import React from 'react';
import styled from 'styled-components';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: SelectOption[];
    placeholder?: string;
}

const SelectWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
`;

const StyledSelect = styled.select`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.inputBorder};
    border-radius: ${({ theme }) => theme.borderRadius};
    font-size: ${({ theme }) => theme.fontSizes.md};
    outline: none;
    background-color: white;
    cursor: pointer;
    transition: border-color ${({ theme }) => theme.transition};

    &:focus {
        border-color: ${({ theme }) => theme.colors.inputFocus};
        box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.inputFocus}33`};
    }

    &:disabled {
        background-color: ${({ theme }) => theme.colors.background};
        cursor: not-allowed;
    }
`;

export const Select: React.FC<SelectProps> = ({ label, options, placeholder, ...props }) => {
    return (
        <SelectWrapper>
            {label && <Label>{label}</Label>}
            <StyledSelect {...props}>
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </StyledSelect>
        </SelectWrapper>
    );
};
