import React from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.body);
root.render(
    <div>
        <h1>File Visualizer</h1>
        <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
    );