import { useContext } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Auth from './Pages/Auth/Auth'
import RoleSelect from './Pages/RoleSelect/RoleSelect'
import Home from './Pages/Home/Home'
import Cart from './Pages/Cart/Cart'
import MyOrders from './Pages/Orders/MyOrders'
import StaffOrders from './Pages/StaffOrders/StaffOrders'
import StaffAddFood from './Pages/StaffAddFood/StaffAddFood'
import { StoreContext } from './context/StoreContext'

const App = () => {
  const { token } = useContext(StoreContext)
  const location = useLocation()
  const isPublicRoute = location.pathname === '/' || location.pathname === '/auth'

  const RequireAuth = ({ children }) => {
    if (!token) return <Navigate to="/" replace />
    return children
  }

  const RequireRole = ({ role, children }) => {
    const userRole = localStorage.getItem('userRole')
    if (!userRole) return <Navigate to="/" replace />
    if (role && userRole !== role) {
      const homePath = userRole === 'staff' ? '/staff/orders' : '/menu'
      return <Navigate to={homePath} replace />
    }
    return children
  }

  const RedirectIfAuthed = ({ children }) => {
    if (token) {
      const userRole = localStorage.getItem('userRole')
      const homePath = userRole === 'staff' ? '/staff/orders' : '/menu'
      return <Navigate to={homePath} replace />
    }
    return children
  }

  return (
    <>
      <div className="app">
        {isPublicRoute ? null : <Navbar />}
        <Routes>
          <Route path="/" element={<RedirectIfAuthed><RoleSelect /></RedirectIfAuthed>} />
          <Route path="/auth" element={<RedirectIfAuthed><Auth /></RedirectIfAuthed>} />
          <Route path="/menu" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/cart" element={<RequireAuth><RequireRole role="student"><Cart /></RequireRole></RequireAuth>} />
          <Route path="/orders" element={<RequireAuth><RequireRole role="student"><MyOrders /></RequireRole></RequireAuth>} />
          <Route path="/staff/orders" element={<RequireAuth><RequireRole role="staff"><StaffOrders /></RequireRole></RequireAuth>} />
          <Route path="/staff/add-food" element={<RequireAuth><RequireRole role="staff"><StaffAddFood /></RequireRole></RequireAuth>} />
          <Route
            path="*"
            element={
              <Navigate
                to={
                  token
                    ? ((localStorage.getItem('userRole') === 'staff') ? '/staff/orders' : '/menu')
                    : '/'
                }
                replace
              />
            }
          />
        </Routes>
      </div>

      {isPublicRoute ? null : <Footer />}
    </>
  );
}

export default App