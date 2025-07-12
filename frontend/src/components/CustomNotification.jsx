import React, { useEffect } from "react";
import "./CustomNotification.css";

const CustomNotification = ({ message, type = "info", onClose, duration = 2500 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  return (
    <div className={`custom-notification ${type}`}>
      <span>{message}</span>
      <button className="close-btn" onClick={onClose}>×</button>
    </div>
  );
};

export default CustomNotification;
