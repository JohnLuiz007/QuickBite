import React from "react";
import styles from "./modal.module.css";

const Modal = ({ open, title, children, onClose }) => {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.close} type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
