import Navbar from './components/navbar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import HeroPage from './components/hero'
import Footer from './components/footer'
function App() {
  

  return (
    <>
    <Navbar /> 
    <HeroPage />
    <Footer />
    <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
