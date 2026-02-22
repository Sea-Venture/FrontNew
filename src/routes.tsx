import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/auth/login'
import RegisterPage from '@/pages/auth/register'
import AdminDashboard from '@/pages/admin/dashboard'
import VoyagerPage from '@/pages/voyager/dashboard'
import FeedDetails from '@/pages/voyager/feed/feed-deatails'
import GuidePage from '@/pages/guide/dashboard'
import LocationPage from '@/pages/admin/locations'
import GuideRequestsPage from '@/pages/admin/guide-requests'
import AnalyticsPage from '@/pages/admin/analytics'
import SecurityPage from '@/pages/admin/security'
import HomeComponent from '@/pages/guide/home'
import PostContainer from '@/pages/guide/posts/post-container'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<div className="p-6"><h2 className="text-2xl font-bold">Admin Home</h2><p>Welcome! Select an option from the sidebar.</p></div>} />
          <Route path="locations" element={<LocationPage />} />
          <Route path="guide-requests" element={<GuideRequestsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="security" element={<SecurityPage />} />
        </Route>
        <Route path="/voyager" element={<VoyagerPage />} />
        <Route path="/voyager/feed/:id" element={<FeedDetails />} />
        <Route path="/guide" element={<GuidePage />}>
          <Route index element={<HomeComponent />} />
          <Route path="posts" element={<PostContainer />} />
          <Route path="maps" element={<div>Maps Page</div>} />
          <Route path="resources" element={<div>Resources Page</div>} />
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<div className="p-8">Page not found</div>} />
      </Routes>
    </BrowserRouter>
  )
}
