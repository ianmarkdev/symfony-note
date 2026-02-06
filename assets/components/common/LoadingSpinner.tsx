import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const SpinnerWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.lg};
`;

const Spinner = styled.div<{ size?: number }>`
    width: ${({ size }) => size || 40}px;
    height: ${({ size }) => size || 40}px;
    border: 3px solid ${({ theme }) => theme.colors.border};
    border-top-color: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
`;

interface LoadingSpinnerProps {
    size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size }) => {
    return (
        <SpinnerWrapper>
            <Spinner size={size} />
        </SpinnerWrapper>
    );
};
