import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import VisiMisi from './pages/VisiMisi.jsx'
import Fasilitas from './pages/Fasilitas.jsx'
import Eskul from './pages/Eskul.jsx'
import Login from './pages/Login.jsx'
import UserDashboard from './pages/UserDashboard.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import NewsAdmin from './pages/admin/NewsAdmin.jsx'
import AnnouncementsAdmin from './pages/admin/AnnouncementsAdmin.jsx'
import AgendaAdmin from './pages/admin/AgendaAdmin.jsx'
import AchievementsAdmin from './pages/admin/AchievementsAdmin.jsx'
import GalleryAdmin from './pages/admin/GalleryAdmin.jsx'
import UsersAdmin from './pages/admin/UsersAdmin.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'
import { RequireAuth, RequireRole } from './auth/guards.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/visi-misi" element={<VisiMisi />} />
          <Route path="/fasilitas" element={<Fasilitas />} />
          <Route path="/eskul" element={<Eskul />} />
          <Route path="/login" element={<Login />} />


          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <UserDashboard />
              </RequireAuth>
            }
          />

          <Route
            path="/admin"
            element={
              <RequireRole roles={['SUPER_ADMIN', 'ADMIN', 'GURU', 'STAFF']}>
                <AdminLayout />
              </RequireRole>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="news" element={<NewsAdmin />} />
            <Route path="announcements" element={<AnnouncementsAdmin />} />
            <Route path="agenda" element={<AgendaAdmin />} />
            <Route path="achievements" element={<AchievementsAdmin />} />
            <Route path="gallery" element={<GalleryAdmin />} />
            <Route path="users" element={<UsersAdmin />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
