import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import FirstSelectionPage from "./pages/FirstSelectionPage/FirstSelectionPage";
import ElementMixingPage from "./pages/ElementMixingPage/ElementMixingPage";
import "./App.scss";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/select-environment" element={<FirstSelectionPage />} />
          <Route path="/customize-sounds" element={<ElementMixingPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
