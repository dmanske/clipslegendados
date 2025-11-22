import React from 'react';
import { MemoryRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import Home from './pages/public/Home';
import ClipDetail from './pages/public/ClipDetail';
import About from './pages/public/About';
import Request from './pages/public/Request';
import Collaborators from './pages/public/Collaborators';
import Dashboard from './pages/admin/Dashboard';
import ClipLibrary from './pages/admin/ClipLibrary';
import EditClip from './pages/admin/EditClip';
import Comments from './pages/admin/Comments';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
    const adminMain = document.querySelector('main.overflow-y-auto');
    if (adminMain) {
      adminMain.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

// Guard for protected routes (Requires Login)
const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#101922] text-white">Carregando...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Guard for Admin routes
const AdminRoute = ({ children }: React.PropsWithChildren) => {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#101922] text-white">Carregando...</div>;

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/app" replace />; // Redirect normal users to main app
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Entrance / Public Landing (If logged in, redirect to app) */}
        <Route path="/" element={user ? <Navigate to="/app" replace /> : <Landing />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main App (Protected - Only for Logged Users) */}
        <Route path="/app" element={<ProtectedRoute><PublicLayout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="clip/:id" element={<ClipDetail />} />
          <Route path="about" element={<About />} />
          <Route path="request" element={<Request />} />
          <Route path="collaborators" element={<Collaborators />} />
        </Route>

        {/* Admin Routes (Protected - Only for Admins) */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clips" element={<ClipLibrary />} />
          <Route path="edit/:id" element={<EditClip />} />
          <Route path="create" element={<EditClip />} />
          <Route path="comments" element={<Comments />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MemoryRouter>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </MemoryRouter>
    </AuthProvider>
  );
};

export default App;