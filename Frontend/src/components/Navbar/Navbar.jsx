import { useContext } from "react";
import style from "../Navbar/navbar.module.css";
import { assets } from "../../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = () => {
  const { token, setToken } = useContext(StoreContext)

  const userRole = localStorage.getItem("userRole") || "student"
  const homePath = userRole === "staff" ? "/menu" : "/menu"

  const navigate = useNavigate()
  const Logout = () => {
    localStorage.removeItem("token")
    setToken("")
    navigate("/")
  }

  return (
    <div className={style.Navbar}>
      <Link to={homePath}><img src={assets.logo} className={style.logo} /></Link>
      <div className={style.tabBar}>
        <NavLink
          to="/menu"
          className={({ isActive }) => `${style.tab} ${isActive ? style.tabActive : ""}`}
        >
          Menu
        </NavLink>
        <NavLink
          to="/cart"
          className={({ isActive }) => `${style.tab} ${isActive ? style.tabActive : ""}`}
        >
          Cart
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) => `${style.tab} ${isActive ? style.tabActive : ""}`}
        >
          Orders
        </NavLink>
      </div>
      <div className={style.navbarRight}>
        {token ? <button onClick={Logout}>Logout</button> : null}

      </div>
    </div>
  );
};

export default Navbar;
