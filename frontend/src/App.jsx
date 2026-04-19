import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import Navbar from './components/Home/navbar'
import Footer from './components/Home/footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'

// Pages
import { HomePage } from './pages/HomePage';
import { JoggingForm, GymForm, YogaForm, SleepForm } from './pages/ExerciseForms';
import { BreakFastForm, LunchForm, DinnerForm, SnackForm } from './pages/FoodForms';
import { AnalysisDashboard } from './pages/AnalysisDashboard';
import Login from './components/login';
import Signup from './components/signup';
import { UserContext } from './context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const loginUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logout }}>
      <BrowserRouter>
        <Navbar /> 
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Home Page */}
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          
          {/* Exercise Routes */}
          <Route path="/Jogging" element={<ProtectedRoute><JoggingForm /></ProtectedRoute>} />
          <Route path="/Gym" element={<ProtectedRoute><GymForm /></ProtectedRoute>} />
          <Route path="/Yoga" element={<ProtectedRoute><YogaForm /></ProtectedRoute>} />
          <Route path="/Sleep" element={<ProtectedRoute><SleepForm /></ProtectedRoute>} />
          
          {/* Food Routes */}
          <Route path="/BreakFast" element={<ProtectedRoute><BreakFastForm /></ProtectedRoute>} />
          <Route path="/Lunch" element={<ProtectedRoute><LunchForm /></ProtectedRoute>} />
          <Route path="/Dinner" element={<ProtectedRoute><DinnerForm /></ProtectedRoute>} />
          <Route path="/Snack" element={<ProtectedRoute><SnackForm /></ProtectedRoute>} />
          
          {/* Analysis Dashboard */}
          <Route path="/analysis" element={<ProtectedRoute><AnalysisDashboard /></ProtectedRoute>} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App
