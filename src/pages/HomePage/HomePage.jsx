import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import "./HomePage.scss";

const HomePage = () => {
  const navigate = useNavigate();
  const [timeoutId, setTimeoutId] = useState(null);
  const [showMsg, setShowMsg] = useState(false);

  const handleClick = (event) => {
    event.preventDefault();
    setShowMsg(true);

    if (timeoutId) clearTimeout(timeoutId);

    const id = setTimeout(() => {
      setShowMsg(false);
      navigate("/select-environment");
    }, 3000);

    setTimeoutId(id);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return (
    <div className="home">
      <Header />
      <main className="home__content">
        <h1>Shape Your Custom Soundscape: Relax or Focus</h1>
        <p className={`home__message ${showMsg ? "home__message--show" : ""}`}>
          <HeadphonesIcon /> For optimal experience, please use headphones <HeadphonesIcon />
        </p>
        <button className="home__start-button" onClick={handleClick}>
          Begin Your Sound Journey
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
