import React from 'react';
import styled from 'styled-components';
import { Header } from './Header';

interface MainLayoutProps {
    children: React.ReactNode;
}

const LayoutContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;

const Main = styled.main`
    flex: 1;
    padding: ${({ theme }) => theme.spacing.lg};
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
`;

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <LayoutContainer>
            <Header />
            <Main>{children}</Main>
        </LayoutContainer>
    );
};
