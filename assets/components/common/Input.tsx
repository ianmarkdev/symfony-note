import React from 'react';
import styled from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme, hasError }) => (hasError ? theme.colors.danger : theme.colors.inputBorder)};
    border-radius: ${({ theme }) => theme.borderRadius};
    font-size: ${({ theme }) => theme.fontSizes.md};
    outline: none;
    transition: border-color ${({ theme }) => theme.transition};

    &:focus {
        border-color: ${({ theme, hasError }) => (hasError ? theme.colors.danger : theme.colors.inputFocus)};
        box-shadow: 0 0 0 2px ${({ theme, hasError }) =>
            hasError ? `${theme.colors.danger}33` : `${theme.colors.inputFocus}33`};
    }

    &::placeholder {
        color: ${({ theme }) => theme.colors.textMuted};
    }

    &:disabled {
        background-color: ${({ theme }) => theme.colors.background};
        cursor: not-allowed;
    }
`;

const ErrorText = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.danger};
`;

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
    return (
        <InputWrapper>
            {label && <Label>{label}</Label>}
            <StyledInput hasError={!!error} {...props} />
            {error && <ErrorText>{error}</ErrorText>}
        </InputWrapper>
    );
};
