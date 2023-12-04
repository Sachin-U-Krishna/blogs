import React from 'react'
import './styles.css'
import NavBar from './components/Navbar'
import Home from './pages/Home'
import MyBlogs from './pages/MyBlogs'
import Login from './pages/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Err from './pages/Err'
import useUsersContext from './hooks/use-users-context'
import Loader from './pages/Loader'
import Signup from './pages/Signup'

const App = () => {
  const { loggedIn } = useUsersContext()

  const ValidRoutes = () => {
    if (loggedIn == 0)
      return (
        <Routes>
          <Route path='/*' element={<Loader />} />
        </Routes>
      )
    else if (loggedIn === 1)
      return (
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/myblogs' element={<MyBlogs />} />
          <Route path='/*' element={<Err />} />
        </Routes>
      )
    else
      return (
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/*' element={<Err />} />
        </Routes>
      )
  }
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <ValidRoutes />
      </BrowserRouter>

    </>
  )
}

export default App