
import React from "react";
import ThemeToggle from "./Themetoggle";
import TaskManager from './Components/Practice'


function App() {


  return (
    <div className="container">
      <h1 className="text-center mt-4">Task Manager</h1>
      <ThemeToggle/>
      <TaskManager/>
    </div>
  )
}

export default App
