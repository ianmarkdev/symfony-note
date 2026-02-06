import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as authApi from '../api/auth';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

const Container = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => theme.spacing.md};
`;

const FormCard = styled.div`
    background: ${({ theme }) => theme.colors.card};
    padding: ${({ theme }) => theme.spacing.xl};
    border-radius: ${({ theme }) => theme.borderRadius};
    box-shadow: ${({ theme }) => theme.boxShadow};
    width: 100%;
    max-width: 400px;
`;

const Title = styled.h1`
    text-align: center;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.primary};
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

const Message = styled.div<{ variant: 'success' | 'error' }>`
    background-color: ${({ theme, variant }) =>
        variant === 'success' ? `${theme.colors.success}15` : `${theme.colors.danger}15`};
    color: ${({ theme, variant }) =>
        variant === 'success' ? theme.colors.success : theme.colors.danger};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadiusSm};
    font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Footer = styled.div`
    text-align: center;
    margin-top: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.textLight};
`;

export const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await authApi.register({ email, password });
            setSuccess(response.message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <FormCard>
                <Title>Register</Title>
                <Form onSubmit={handleSubmit}>
                    {error && <Message variant="error">{error}</Message>}
                    {success && <Message variant="success">{success}</Message>}
                    <Input
                        type="email"
                        label="Email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={!!success}
                    />
                    <Input
                        type="password"
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={!!success}
                    />
                    <Input
                        type="password"
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={!!success}
                    />
                    <Button type="submit" fullWidth disabled={isLoading || !!success}>
                        {isLoading ? 'Registering...' : 'Register'}
                    </Button>
                </Form>
                <Footer>
                    Already have an account? <Link to="/login">Login</Link>
                </Footer>
            </FormCard>
        </Container>
    );
};
