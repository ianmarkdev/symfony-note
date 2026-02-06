import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    html, body, #app {
        height: 100%;
        width: 100%;
    }

    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 16px;
        color: #333333;
        background-color: #F5F5F5;
        line-height: 1.5;
    }

    a {
        color: #4A90D9;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }

    button {
        cursor: pointer;
        font-family: inherit;
    }

    input, textarea, select {
        font-family: inherit;
        font-size: inherit;
    }

    h1, h2, h3, h4, h5, h6 {
        font-weight: 600;
        line-height: 1.2;
    }
`;
