/**
 * AgriMatch App Entry Point
 * - Renders the Home page
 * - Sets up global styles and fonts
 */
import './bootstrap';
import '../css/app.css';
import { createRoot } from 'react-dom/client';
import Home from './pages/Home';

// Mount the React app
const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<Home />);
}
