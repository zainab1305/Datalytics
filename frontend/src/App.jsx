import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";  // Remove BrowserRouter from here
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import Visualization from "./components/Visualization";
import DataContext from "./components/DataContext";
import UploadFile from "./components/UploadFile";
import AdminPanel from "./components/AdminPanel";
function App() {
  const [data, setData] = useState([]);

  return (
    <DataContext.Provider value={{ data, setData }}>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/visualization" element={<Visualization />} />
        <Route path="/uploadFile" element={<UploadFile/>}/>
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </DataContext.Provider>
  );
}

export default App;
