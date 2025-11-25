import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import Home from './pages/public/Home';
import Library from './pages/public/Library';
import ClipDetail from './pages/public/ClipDetail';
import About from './pages/public/About';
import Request from './pages/public/Request';
import TranslationRequest from './pages/public/TranslationRequest';
import Collaborators from './pages/public/Collaborators';
import Dashboard from './pages/admin/Dashboard';
import ClipLibrary from './pages/admin/ClipLibrary';
import EditClip from './pages/admin/EditClip';
import Comments from './pages/admin/Comments';
import Submissions from './pages/admin/Submissions';
import Requests from './pages/admin/Requests';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './context/ToastContext';
import { ConfirmProvider } from './context/ConfirmContext';

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
  const location = useLocation();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#101922] text-white">Carregando...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

// Guard for Admin routes
const AdminRoute = ({ children }: React.PropsWithChildren) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#101922] text-white">Carregando...</div>;

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to="/app" replace />;

  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('[AppRoutes] Rendering - loading:', loading, 'user:', user?.email);

  if (loading) {
    console.log('[AppRoutes] Showing loading screen');
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#101922]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Entrance / Public Landing (If logged in, redirect to app) */}
        <Route path="/" element={user ? <Navigate to="/app" replace /> : <Landing />} />

        {/* Auth Routes - Redirect to app if already logged in */}
        <Route path="/login" element={user ? <Navigate to="/app" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/app" replace /> : <Register />} />

        {/* Main App (Protected - Only for Logged Users) */}
        <Route path="/app" element={<ProtectedRoute><PublicLayout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="library" element={<Library />} />
          <Route path="clip/:id" element={<ClipDetail />} />
          <Route path="about" element={<About />} />
          <Route path="request" element={<Request />} />
          <Route path="translation-request" element={<TranslationRequest />} />
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
          <Route path="submissions" element={<Submissions />} />
          <Route path="requests" element={<Requests />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NotificationProvider>
          <ToastProvider>
            <ConfirmProvider>
              <AppRoutes />
            </ConfirmProvider>
          </ToastProvider>
        </NotificationProvider>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;