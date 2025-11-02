import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import QuestionnairePage from './pages/QuestionnairePage';
import AssessmentPage from './pages/AssessmentPage';
import SubmittedQuestionnaires from './components/SubmittedQuestionnaires';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

// Role-based Protected Route Component (Full Access Only)
const FullAccessRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  // If user is assessment type, redirect to questionnaire
  if (user?.accessType === 'assessment') {
    return <Navigate to="/questionnaire" />;
  }
  
  return <>{children}</>;
};

// Submitted Page Wrapper
const SubmittedPage = () => {
  const navigate = (path: string) => {
    window.location.href = path;
  };

  return <SubmittedQuestionnaires onBack={() => navigate('/dashboard')} />;
};

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <FullAccessRoute>
              <Dashboard />
            </FullAccessRoute>
          }
        />
        <Route
          path="/questionnaire"
          element={
            <ProtectedRoute>
              <QuestionnairePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessment"
          element={
            <FullAccessRoute>
              <AssessmentPage />
            </FullAccessRoute>
          }
        />
        <Route
          path="/submitted"
          element={
            <FullAccessRoute>
              <SubmittedPage />
            </FullAccessRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
