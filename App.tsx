import React from 'react';
import { MemoryRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    // Scroll window (primary for public layout)
    window.scrollTo(0, 0);
    
    // Scroll admin main container if it exists (for admin layout)
    const adminMain = document.querySelector('main.overflow-y-auto');
    if (adminMain) {
      adminMain.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <MemoryRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="clip/:id" element={<ClipDetail />} />
          <Route path="about" element={<About />} />
          <Route path="request" element={<Request />} />
          <Route path="collaborators" element={<Collaborators />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clips" element={<ClipLibrary />} />
          <Route path="edit/:id" element={<EditClip />} />
          <Route path="create" element={<EditClip />} />
          <Route path="comments" element={<Comments />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

export default App;