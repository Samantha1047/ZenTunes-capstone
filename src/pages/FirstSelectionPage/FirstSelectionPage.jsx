import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Howl } from "howler";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import EnvironmentData from "../../data/environments.json";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import "./FirstSelectionPage.scss";

const FirstSelectionPage = () => {
  const navigate = useNavigate();
  const [activeBackground, setActiveBackground] = useState("");
  const [sound, setSound] = useState(null);

  const handleMouseEnter = (environment) => {
    setActiveBackground(environment);

    if (sound) {
      sound.unload();
    }

    const newSound = new Howl({
      src: [`/assets/sound/${environment}.wav`],
      loop: true,
      volume: 0.6,
    });
    newSound.play();
    setSound(newSound);
  };

  const handleMouseLeave = () => {
    setActiveBackground("");
    if (sound) {
      sound.stop();
    }
  };

  const handleClick = (environment) => {
    navigate("/customize-sounds", { state: { environment } });
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unload();
      }
    };
  }, [sound]);

  return (
    <div className="first-selection">
      <Header />
      {activeBackground && (
        <video autoPlay loop muted playsInline className={`first-selection__background-video ${activeBackground ? "first-selection__background-video--visible" : ""}`}>
          <source src={`/assets/videos/${activeBackground}.mp4`} type="video/mp4" />
        </video>
      )}
      {activeBackground && <div className={"first-selection__overlay"}></div>}
      <main className="selection-content">
        <div
          className={activeBackground ? ` selection-content__background-active selection-content__background-active--${activeBackground}` : "selection-content__background-active"}>
          <h1>Where Would You Like To Be?</h1>
          <p className="selection-content__instruction">
            <AdsClickIcon /> Hover to Preview
          </p>
        </div>
        <div className="selection-content__environment-buttons">
          {EnvironmentData.map((env) => (
            <button
              key={env.name}
              onMouseEnter={() => handleMouseEnter(env.name)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(env)}
              className="selection-content__environment-buttons--button">
              {env.displayName}
            </button>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FirstSelectionPage;
