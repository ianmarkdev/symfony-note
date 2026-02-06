import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';

const HeaderContainer = styled.header`
    background-color: ${({ theme }) => theme.colors.card};
    box-shadow: ${({ theme }) => theme.boxShadow};
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Logo = styled.h1`
    font-size: ${({ theme }) => theme.fontSizes.xl};
    color: ${({ theme }) => theme.colors.primary};
    margin: 0;
`;

const UserSection = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
`;

const UserEmail = styled.span`
    color: ${({ theme }) => theme.colors.textLight};
`;

export const Header: React.FC = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <HeaderContainer>
            <Logo>Notes App</Logo>
            <UserSection>
                <UserEmail>{user?.email}</UserEmail>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                    Logout
                </Button>
            </UserSection>
        </HeaderContainer>
    );
};
