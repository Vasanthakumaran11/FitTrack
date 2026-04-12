import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import SignUp from './components/signup.jsx'
import Login from './components/login.jsx'

const router = createBrowserRouter([
  { path: "/Home", element: <App /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/", element: <Login /> },
  {path: "/Jogging", element: <h1>Jogging</h1>},
  {path: "/Cycling", element: <h1>Cycling</h1>},
  {path: "/Sleeping", element: <h1>Sleeping</h1>},
  {path:"/Breakfast", element: <h1>Breakfast</h1>},
  {path:"/Lunch", element: <h1>Lunch</h1>},
  {path:"/Dinner", element: <h1>Dinner</h1>},
  {path:"/Yoga", element: <h1>Yoga</h1>},
  {path:"/Water", element: <h1>Water</h1>},
  {path:"/Gym", element: <h1>Gym</h1>},
  {path:"*", element: <h1>404 Not Found</h1>}
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
) 

