import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Howl, Howler } from "howler";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./ElementSelectionPage.scss";

const ElementSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeBackground, setActiveBackground] = useState("");
  const [sound, setSound] = useState(null);
  const [selectedElements, setSelectedElements] = useState(new Array(4).fill({ selected: false, volume: 50, intensity: 50 }));
  const [audioContextStarted, setAudioContextStarted] = useState(false);

  const { environment } = location.state || {};
  const elements = environment ? environment.elements : [];

  useEffect(() => {
    if (!audioContextStarted) {
      const startAudioContext = () => {
        Howler.ctx.resume().then(() => {
          setAudioContextStarted(true);
        });
        document.removeEventListener("click", startAudioContext);
      };
      document.addEventListener("click", startAudioContext);
    }
  }, [audioContextStarted]);

  const handleMouseEnter = (element) => {
    setActiveBackground(element);
    if (sound) {
      sound.unload();
    }

    const newSound = new Howl({
      src: [`/assets/sound/${element}/${element}_1.mp3`],
      loop: true,
      volume: selectedElements.find((el) => el.selected && el.name === element)?.volume / 100 || 0.8,
    });

    if (audioContextStarted) {
      newSound.play();
    }

    setSound(newSound);
  };

  const handleMouseLeave = () => {
    setActiveBackground("");
    if (sound) {
      sound.stop();
    }
  };

  const toggleElementSelection = (index) => {
    setSelectedElements(selectedElements.map((item, idx) => (idx === index ? { ...item, selected: !item.selected } : item)));
  };

  const handleSliderChange = (index, type, value) => {
    const updatedElements = selectedElements.map((item, idx) => (idx === index ? { ...item, [type]: parseInt(value) } : item));
    setSelectedElements(updatedElements);

    if (type === "volume" && sound) {
      sound.volume(value / 100);
    }
  };

  const handleResult = () => {
    navigate("/results", { state: { selectedElements } });
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unload();
      }
    };
  }, [sound]);

  return (
    <div className="element-selection">
      <Header />
      {activeBackground && (
        <video autoPlay loop muted playsInline className="element-selection__background-video">
          <source src={`/assets/videos/${activeBackground}.mp4`} type="video/mp4" />
        </video>
      )}
      <main className="selection-content">
        <h1 className={activeBackground ? `selection-content__background-active--${activeBackground}` : "selection-content__background-active"}>
          Do you want to hear this {environment.envPhase}?
        </h1>
        <div className="selection-content__element-buttons">
          {elements.map((ele, index) => (
            <div key={ele} className={ele} onMouseEnter={() => handleMouseEnter(ele)} onMouseLeave={handleMouseLeave}>
              <button className={`selection-content__element-buttons--button ${selectedElements[index].selected ? "selected" : ""}`} onClick={() => toggleElementSelection(index)}>
                {ele.replace("-", " ")}
              </button>
              {selectedElements[index].selected && (
                <div className="selection-content__controls">
                  <p>Volume:</p>
                  <input type="range" min="0" max="100" value={selectedElements[index].volume} onChange={(e) => handleSliderChange(index, "volume", e.target.value)} />
                  <p>Frequency:</p>
                  <input type="range" min="0" max="100" value={selectedElements[index].intensity} onChange={(e) => handleSliderChange(index, "intensity", e.target.value)} />
                </div>
              )}
            </div>
          ))}
        </div>
        <button className="element-selection__submit" onClick={handleResult}>
          Generate Your Own Soundscape!
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default ElementSelectionPage;
