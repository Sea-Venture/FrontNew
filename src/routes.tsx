import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/auth/login'
import RegisterPage from '@/pages/auth/register'
import AdminDashboard from '@/pages/admin/dashboard'
import VoyagerPage from '@/pages/voyager/dashboard'
import GuidePage from '@/pages/guide/dashboard'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/voyager" element={<VoyagerPage />} />
        <Route path="/guide" element={<GuidePage />} />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<div className="p-8">Page not found</div>} />
      </Routes>
    </BrowserRouter>
  )
}
