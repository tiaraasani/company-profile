import { lazy } from 'react'
import { Route, Routes } from 'react-router'
import { RootLayout } from '@/components/layout/RootLayout'
import HomePage from '@/routes/HomePage'

// Home is bundled with the shell because it is the most visited URL; every other page
// is its own chunk, loaded when the visitor navigates there.
const AboutPage = lazy(() => import('@/routes/AboutPage'))
const ServicesPage = lazy(() => import('@/routes/ServicesPage'))
const TeamPage = lazy(() => import('@/routes/TeamPage'))
const BlogListPage = lazy(() => import('@/routes/BlogListPage'))
const BlogDetailPage = lazy(() => import('@/routes/BlogDetailPage'))
const CreateBlogPage = lazy(() => import('@/routes/CreateBlogPage'))
const LoginPage = lazy(() => import('@/routes/LoginPage'))
const NotFoundPage = lazy(() => import('@/routes/NotFoundPage'))

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="teams" element={<TeamPage />} />
        <Route path="blog" element={<BlogListPage />} />
        {/* Static segment wins over the :slug pattern in react-router's ranking. */}
        <Route path="blog/new" element={<CreateBlogPage />} />
        <Route path="blog/:slug" element={<BlogDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
