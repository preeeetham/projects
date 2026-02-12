import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Records } from './pages/Records';
import { RecordDetail } from './pages/RecordDetail';
import { CreateRecord } from './pages/CreateRecord';
import { AuditTrail } from './pages/AuditTrail';
import { Search } from './pages/Search';
import { Settings } from './pages/Settings';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/records" element={<ProtectedRoute><Records /></ProtectedRoute>} />
          <Route path="/dashboard/create-record" element={<ProtectedRoute><CreateRecord /></ProtectedRoute>} />
          <Route path="/records/:id" element={<ProtectedRoute><RecordDetail /></ProtectedRoute>} />
          <Route path="/audit-trail" element={<ProtectedRoute><AuditTrail /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
