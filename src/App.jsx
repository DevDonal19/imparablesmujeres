import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogPost from './pages/BlogPost';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminPosts from './pages/AdminPosts';
import AdminUsers from './pages/AdminUsers';
import AdminProfile from './pages/AdminProfile';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSettings from './pages/AdminSettings';
import AdminCategories from './pages/AdminCategories';
import AdminSections from './pages/AdminSections';
import AdminComments from './pages/AdminComments';
import AdminTestimonials from './pages/AdminTestimonials';
import ProtectedRoute from './components/ProtectedRoute';

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <CircularProgress />
  </Box>
);

const App = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="sections" element={<AdminSections />} />
          <Route path="comments" element={<AdminComments />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
