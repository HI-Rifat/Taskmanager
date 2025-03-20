import React from "react";
import { useTheme } from "./Themeprovider";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`btn ${theme === "light" ? "btn-dark" : "btn-light"} position-absolute top-0 end-0 mt-2 me-2`}
    >
      Switch to {theme === "light" ? "Dark" : "Light"} Mode
    </button>
  );
};

export default ThemeToggle;
