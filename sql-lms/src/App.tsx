import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Learn from './pages/Learn'
import Problem from './pages/Problem'
import AdminLayout from './pages/admin/AdminLayout'
import AdminProblems from './pages/admin/Problems'
import ProblemForm from './pages/admin/ProblemForm'
import AdminDatasets from './pages/admin/Datasets'
import DatasetForm from './pages/admin/DatasetForm'
import Whitelist from './pages/admin/Whitelist'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/learn" element={<Learn />} />
          <Route path="/problem/:id" element={<Problem />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/problems" replace />} />
            <Route path="problems" element={<AdminProblems />} />
            <Route path="problems/new" element={<ProblemForm />} />
            <Route path="problems/:id/edit" element={<ProblemForm />} />
            <Route path="datasets" element={<AdminDatasets />} />
            <Route path="datasets/new" element={<DatasetForm />} />
            <Route path="datasets/:id/edit" element={<DatasetForm />} />
            <Route path="whitelist" element={<Whitelist />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/learn" replace />} />
        <Route path="*" element={<Navigate to="/learn" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
