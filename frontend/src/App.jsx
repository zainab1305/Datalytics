import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";  // Remove BrowserRouter from here
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import Visualization from "./components/Visualization";
import ExcelDataContext from "./components/ExcelDataContext";
import UploadFile from "./components/UploadFile";
function App() {
  const [excelData, setExcelData] = useState([]);

  return (
    <ExcelDataContext.Provider value={{ excelData, setExcelData }}>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/visualization" element={<Visualization />} />
        <Route path="/uploadFile" element={<UploadFile/>}/>
      </Routes>
    </ExcelDataContext.Provider>
  );
}

export default App;
