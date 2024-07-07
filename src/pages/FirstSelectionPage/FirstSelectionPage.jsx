import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Howl } from "howler";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import EnvironmentData from "../../data/environments.json";
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
      src: [`/assets/sound/${environment}.mp3`],
      loop: true,
      volume: 0.8,
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

  const handleClick = () => {
    navigate("/customize-sounds");
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
        <video autoPlay loop muted playsInline className="first-selection__background-video">
          <source src={`/assets/videos/${activeBackground}.mp4`} type="video/mp4" />
        </video>
      )}
      <main className="selection-content">
        <h1 className={activeBackground ? `selection-content__background-active--${activeBackground}` : "selection-content__background-active"}>Where Would You Like to be?</h1>
        <div className="selection-content__environment-buttons">
          {EnvironmentData.map((env) => (
            <button
              key={env.name}
              onMouseEnter={() => handleMouseEnter(env.name)}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
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
