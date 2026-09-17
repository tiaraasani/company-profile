import { Route, Routes } from 'react-router'
import { RootLayout } from '@/components/layout/RootLayout'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import HomePage from '@/routes/HomePage'
import { pages } from '@/routes/pages'

// Home is bundled with the shell because it is the most visited URL; every other page
// is its own chunk (see routes/pages.ts), loaded when the visitor navigates there.
export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<pages.about />} />
        <Route path="services" element={<pages.services />} />
        <Route path="teams" element={<pages.teams />} />
        <Route path="blog" element={<pages.blogList />} />
        {/* Static segment wins over the :slug pattern in react-router's ranking. */}
        <Route
          path="blog/new"
          element={
            <ProtectedRoute>
              <pages.createBlog />
            </ProtectedRoute>
          }
        />
        <Route path="blog/:slug" element={<pages.blogDetail />} />
        <Route path="login" element={<pages.login />} />
        <Route path="*" element={<pages.notFound />} />
      </Route>
    </Routes>
  )
}
