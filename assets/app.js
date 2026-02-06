/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/app.scss';

import Root from './Root';

const rootNode = createRoot(document.getElementById('app'));

rootNode.render(<Root />);
