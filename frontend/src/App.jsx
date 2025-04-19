import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom"
import FloatingShape from "./component/FloatingShape"
import { useAuthStore } from "./store/authStore"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import EmailVerificationPage from "./pages/EmailVerificationPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import LoadingSpinner from "./component/LoadingSpinner"
import { Toaster } from 'react-hot-toast'
import { useEffect } from "react"
import DashboardPage from "./pages/DashboardPage"

const RedirectAuthenticatedUser = ({children}) => {
  const {isAuthenticated, user} = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
}

const ProtectedRoute = ({children}) => {
  const {isAuthenticated, user} = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
}

function App() {

  const {isCheckingAuth, checkAuth, isAuthenticated, user} = useAuthStore();
  useEffect(() => {
    checkAuth();
  }
  , [checkAuth]);

  if (isCheckingAuth) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen 
      bg-gradient-to-br
       flex items-center 
       justify-center relative 
       overflow-hidden">

        <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>} />
          <Route path="/signup" element={
            <RedirectAuthenticatedUser>
            <SignUpPage />
          </RedirectAuthenticatedUser>} />
          <Route path="/login" element={<RedirectAuthenticatedUser>
            <LoginPage />
          </RedirectAuthenticatedUser>} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/forgot-password" element={<RedirectAuthenticatedUser>
            <ForgotPasswordPage />
          </RedirectAuthenticatedUser>} />
          <Route path="/reset-password/:token" element={<RedirectAuthenticatedUser>
            <ResetPasswordPage />
          </RedirectAuthenticatedUser>} />
          <Route path="*" element={<Navigate to = "/" replace/>} />
        </Routes>
        </BrowserRouter>

        <Toaster />
      </div>
  )
}

export default App
