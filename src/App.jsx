import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/appStore';

// 公共页面
import Login from './pages/Login';

// 儿童端页面
import ChildTest from './pages/Child/ChildTest';
import ChildHome from './pages/Child/ChildHome';
import TaskDetail from './pages/Child/TaskDetail';
import Mall from './pages/Child/Mall';
import Progress from './pages/Child/Progress';
import ChildProfile from './pages/Child/ChildProfile';

// 家长端页面
import Dashboard from './pages/Parent/Dashboard';
import ChildrenManagement from './pages/Parent/ChildrenManagement';
import TaskManagement from './pages/Parent/TaskManagement';
import CheckinReview from './pages/Parent/CheckinReview';
import TextbookManagement from './pages/Parent/TextbookManagement';
import LearningReports from './pages/Parent/LearningReports';

// 把 ProtectedRoute 移到组件外部，避免每次渲染重新创建
const ProtectedRoute = ({ user, children, role }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'child' ? '/child/home' : '/parent/dashboard'} />;
  }
  return children;
};

const App = () => {
  const { user, setUser } = useStore();
  const initializedRef = useRef(false);

  // 只在第一次初始化时执行一次
  useEffect(() => {
    if (!initializedRef.current) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (e) {
          localStorage.removeItem('user');
        }
      }
      initializedRef.current = true;
    }
  }, []); // 空依赖数组，只执行一次

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/child/test" 
          element={
            <ProtectedRoute user={user} role="child">
              <ChildTest />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/child/home" 
          element={
            <ProtectedRoute user={user} role="child">
              <ChildHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/child/task/:id" 
          element={
            <ProtectedRoute user={user} role="child">
              <TaskDetail />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/child/mall" 
          element={
            <ProtectedRoute user={user} role="child">
              <Mall />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/child/progress" 
          element={
            <ProtectedRoute user={user} role="child">
              <Progress />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/child/profile" 
          element={
            <ProtectedRoute user={user} role="child">
              <ChildProfile />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/parent/dashboard" 
          element={
            <ProtectedRoute user={user} role="parent">
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/parent/children" 
          element={
            <ProtectedRoute user={user} role="parent">
              <ChildrenManagement />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/parent/tasks" 
          element={
            <ProtectedRoute user={user} role="parent">
              <TaskManagement />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/parent/checkins" 
          element={
            <ProtectedRoute user={user} role="parent">
              <CheckinReview />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/parent/textbooks" 
          element={
            <ProtectedRoute user={user} role="parent">
              <TextbookManagement />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/parent/reports" 
          element={
            <ProtectedRoute user={user} role="parent">
              <LearningReports />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/" 
          element={
            user ? (
              user.role === 'child' ? (
                <Navigate to="/child/home" />
              ) : (
                <Navigate to="/parent/dashboard" />
              )
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
