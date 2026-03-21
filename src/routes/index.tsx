import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { BooksList } from '@/pages/books/BooksList';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { MyLoans } from '@/pages/loans/MyLoans';

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <BooksList /> },
          { path: 'loans', element: <MyLoans /> },
          {
            path: 'admin',
            element: <ProtectedRoute allowedRoles={['ADMIN']} />,
            children: [
              { index: true, element: <AdminDashboard /> },
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
