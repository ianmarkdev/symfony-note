import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

const StyledButton = styled.button<ButtonProps>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.sm};
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius};
    font-weight: 500;
    transition: all ${({ theme }) => theme.transition};
    cursor: pointer;

    ${({ size, theme }) => {
        switch (size) {
            case 'sm':
                return css`
                    padding: ${theme.spacing.xs} ${theme.spacing.sm};
                    font-size: ${theme.fontSizes.sm};
                `;
            case 'lg':
                return css`
                    padding: ${theme.spacing.md} ${theme.spacing.lg};
                    font-size: ${theme.fontSizes.lg};
                `;
            default:
                return css`
                    padding: ${theme.spacing.sm} ${theme.spacing.md};
                    font-size: ${theme.fontSizes.md};
                `;
        }
    }}

    ${({ variant, theme }) => {
        switch (variant) {
            case 'secondary':
                return css`
                    background-color: ${theme.colors.secondary};
                    color: white;
                    &:hover:not(:disabled) {
                        background-color: #5a6268;
                    }
                `;
            case 'danger':
                return css`
                    background-color: ${theme.colors.danger};
                    color: white;
                    &:hover:not(:disabled) {
                        background-color: ${theme.colors.dangerHover};
                    }
                `;
            case 'success':
                return css`
                    background-color: ${theme.colors.success};
                    color: white;
                    &:hover:not(:disabled) {
                        background-color: #218838;
                    }
                `;
            default:
                return css`
                    background-color: ${theme.colors.primary};
                    color: white;
                    &:hover:not(:disabled) {
                        background-color: ${theme.colors.primaryHover};
                    }
                `;
        }
    }}

    ${({ fullWidth }) =>
        fullWidth &&
        css`
            width: 100%;
        `}

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    ...props
}) => {
    return (
        <StyledButton variant={variant} size={size} fullWidth={fullWidth} {...props}>
            {children}
        </StyledButton>
    );
};
