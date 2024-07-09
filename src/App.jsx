import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import FirstSelectionPage from "./pages/FirstSelectionPage/FirstSelectionPage";
import ElementSelectionPage from "./pages/ElementSelectionPage/ElementSelectionPage";
import ResultsPage from "./pages/ResultsPage/ResultsPage";
import "./App.scss";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/select-environment" element={<FirstSelectionPage />} />
          <Route path="/customize-sounds" element={<ElementSelectionPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;