import './bootstrap';
import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/dashboards/FarmerDashboard';
import BuyerDashboard from './pages/dashboards/BuyerDashboard';
import ProductDetail from './pages/dashboards/buyer/ProductDetail';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/farmer/dashboard"
                    element={
                        <ProtectedRoute role="petani">
                            <FarmerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/buyer/dashboard"
                    element={
                        <ProtectedRoute role="pembeli">
                            <BuyerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/buyer/product/:id"
                    element={
                        <ProtectedRoute role="pembeli">
                            <ProductDetail />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute role="superadmin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
