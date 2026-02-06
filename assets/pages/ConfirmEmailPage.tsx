import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as authApi from '../api/auth';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const Container = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => theme.spacing.md};
`;

const Card = styled.div`
    background: ${({ theme }) => theme.colors.card};
    padding: ${({ theme }) => theme.spacing.xl};
    border-radius: ${({ theme }) => theme.borderRadius};
    box-shadow: ${({ theme }) => theme.boxShadow};
    width: 100%;
    max-width: 400px;
    text-align: center;
`;

const Title = styled.h1<{ variant?: 'success' | 'error' }>`
    color: ${({ theme, variant }) =>
        variant === 'success'
            ? theme.colors.success
            : variant === 'error'
            ? theme.colors.danger
            : theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Message = styled.p`
    color: ${({ theme }) => theme.colors.textLight};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StyledLink = styled(Link)`
    display: inline-block;
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.borderRadius};
    text-decoration: none;
    transition: background-color ${({ theme }) => theme.transition};

    &:hover {
        background-color: ${({ theme }) => theme.colors.primaryHover};
        text-decoration: none;
    }
`;

export const ConfirmEmailPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const confirmEmail = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Invalid confirmation link.');
                return;
            }

            try {
                const response = await authApi.confirmEmail(token);
                setStatus('success');
                setMessage(response.message);
            } catch (err: any) {
                setStatus('error');
                setMessage(err.response?.data?.error || 'Confirmation failed. The link may be invalid or expired.');
            }
        };

        confirmEmail();
    }, [token]);

    if (status === 'loading') {
        return (
            <Container>
                <Card>
                    <Title>Confirming Email...</Title>
                    <LoadingSpinner />
                </Card>
            </Container>
        );
    }

    return (
        <Container>
            <Card>
                <Title variant={status}>{status === 'success' ? 'Email Confirmed!' : 'Confirmation Failed'}</Title>
                <Message>{message}</Message>
                <StyledLink to="/login">Go to Login</StyledLink>
            </Card>
        </Container>
    );
};
