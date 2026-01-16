import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./auth.module.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

const Auth = () => {
  const [mode, setMode] = useState("login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { URl, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const title = useMemo(() => (mode === "login" ? "Sign in" : "Create account"), [mode]);

  const onChangehandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const userRole = localStorage.getItem("userRole");
    if (!userRole) {
      navigate("/");
      return;
    }

    const redirectTo = "/menu";

    const endpoint = mode === "login" ? "/api/user/login" : "/api/user/register";
    const response = await axios.post(URl + endpoint, data);
    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      navigate(redirectTo);
      return;
    }
    alert(response.data.message);
  };

  return (
    <div className={styles.AuthPage}>
      <div className={styles.BrandPanel}>
        <img src={assets.logo} alt="" className={styles.Logo} />
        <h1 className={styles.Headline}>Order ahead, skip the queue.</h1>
        <p className={styles.Subtitle}>Sign in to view the menu and your cart.</p>
      </div>

      <div className={styles.FormPanel}>
        <form className={styles.Form} onSubmit={onSubmit}>
          <h2 className={styles.Title}>{title}</h2>

          {mode === "register" ? (
            <input
              className={styles.Input}
              type="text"
              name="name"
              placeholder="Your name"
              value={data.name}
              onChange={onChangehandler}
              required
            />
          ) : null}

          <input
            className={styles.Input}
            type="email"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={onChangehandler}
            required
          />
          <input
            className={styles.Input}
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={onChangehandler}
            required
          />

          <button className={styles.PrimaryButton} type="submit">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>

          <p className={styles.SwitchText}>
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <span className={styles.SwitchLink} onClick={() => setMode("register")}>
                  Create one
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span className={styles.SwitchLink} onClick={() => setMode("login")}>
                  Sign in
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
