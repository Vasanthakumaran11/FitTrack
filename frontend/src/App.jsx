import Navbar from './components/Home/navbar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import HeroPage from './components/Home/hero'
import Footer from './components/Home/footer'
import { UserContext } from './components/login';

function App() {
  const data = "Raja";

  return (
    <>
    <UserContext.Provider value={data}>
      <Navbar /> 
      <HeroPage />
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </UserContext.Provider>
    </>
  )
}

export default App
