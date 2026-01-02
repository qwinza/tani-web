/**
 * AgriMatch App Entry Point
 * - Renders the Home page
 * - Sets up global styles and fonts
 */
import './bootstrap';
import '../css/app.css';
import { createRoot } from 'react-dom/client';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    const path = window.location.pathname || '/';
    if (path.toLowerCase().startsWith('/login')) {
        root.render(<Login />);
    } else if (path.toLowerCase().startsWith('/register')) {
        root.render(<Register />);
    } else {
        root.render(<Home />);
    }
}
