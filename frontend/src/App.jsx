import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Home/navbar'
import Footer from './components/Home/footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import { UserContext } from './components/login';

// Pages
import { HomePage } from './pages/HomePage';
import { JoggingForm, GymForm, YogaForm, SleepForm } from './pages/ExerciseForms';
import { BreakFastForm, LunchForm, DinnerForm, SnackForm } from './pages/FoodForms';
import { AnalysisDashboard } from './pages/AnalysisDashboard';

function App() {
  const data = "Raja";

  return (
    <>
      <UserContext.Provider value={data}>
        <BrowserRouter>
          <Navbar /> 
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<HomePage />} />
            <Route path="/Home" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            
            {/* Exercise Routes */}
            <Route path="/Jogging" element={<JoggingForm />} />
            <Route path="/Gym" element={<GymForm />} />
            <Route path="/Yoga" element={<YogaForm />} />
            <Route path="/Sleep" element={<SleepForm />} />
            
            {/* Food Routes */}
            <Route path="/BreakFast" element={<BreakFastForm />} />
            <Route path="/Lunch" element={<LunchForm />} />
            <Route path="/Dinner" element={<DinnerForm />} />
            <Route path="/Snack" element={<SnackForm />} />
            
            {/* Analysis Dashboard */}
            <Route path="/analysis" element={<AnalysisDashboard />} />
            
            {/* Fallback */}
            <Route path="*" element={<HomePage />} />
          </Routes>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
      </UserContext.Provider>
    </>
  )
}

export default App
