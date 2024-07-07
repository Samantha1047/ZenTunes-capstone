import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./ResultsPage.scss";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedElements } = location.state || { selectedElements: [] };

  const handleTryAgain = () => {
    navigate("/");
  };

  return (
    <div className="result-page">
      <Header />
      <main className="result-content">
        <h1>Experience Your Specially Crafted Soundscape!</h1>
        <audio controls className="audio-player">
          <source src="/path/to/generated/audio/track.mp3" type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
        <button onClick={handleTryAgain} className="try-again-button">
          Create Another Soundscape
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default ResultPage;
