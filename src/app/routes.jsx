import AuthGuard from 'app/auth/AuthGuard'
import chartsRoute from 'app/views/charts/ChartsRoute'
import dashboardRoutes from 'app/views/dashboard/DashboardRoutes'
import managementRoutes from 'app/views/manage/ManagementRoutes'
import materialRoutes from 'app/views/material-kit/MaterialRoutes'
import NotFound from 'app/views/sessions/NotFound'
import sessionRoutes from 'app/views/sessions/SessionRoutes'
import { Navigate, Outlet } from 'react-router-dom'
import MatxLayout from './components/MatxLayout/MatxLayout'

const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...dashboardRoutes,
      ...managementRoutes,
      ...chartsRoute,
      ...materialRoutes,
    ],
  },
  ...sessionRoutes,
  { path: '/', element: <Navigate to="dashboard" /> },
  { path: '*', element: <NotFound /> },
]

export default routes
