import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./roleSelect.module.css";
import { assets } from "../../assets/assets";

const RoleSelect = () => {
  const navigate = useNavigate();

  const choose = (role) => {
    localStorage.setItem("userRole", role);
    navigate("/auth");
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <img src={assets.logo} alt="" className={styles.logo} />
        <h1 className={styles.title}>Welcome to QuickBite</h1>
        <p className={styles.subtitle}>Continue as:</p>
        <div className={styles.actions}>
          <button className={styles.primary} type="button" onClick={() => choose("student")}>
            Student
          </button>
          <button className={styles.primary} type="button" onClick={() => choose("staff")}>
            Staff
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;
