import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Howl } from "howler";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./ElementSelectionPage.scss";

const ElementSelectionPage = () => {
  const navigate = useNavigate();
  const [activeBackground, setActiveBackground] = useState("");
  const [sound, setSound] = useState(null);
  const [selectedElements, setSelectedElements] = useState(new Array(4).fill({ selected: false, volume: 50, intensity: 50 }));

  const rainyData = ["Thunder", "Windchime", "Bamboo-Fountain", "Traffic"];

  const handleMouseEnter = (element) => {
    setActiveBackground(element);

    if (sound) {
      sound.unload();
    }

    const newSound = new Howl({
      src: [`/assets/sound/${element}.mp3`],
      loop: true,
      volume: 1,
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

  const toggleElementSelection = (index) => {
    setSelectedElements(selectedElements.map((item, idx) => (idx === index ? { ...item, selected: !item.selected } : item)));
  };

  const handleSliderChange = (index, type, value) => {
    setSelectedElements(selectedElements.map((item, idx) => (idx === index ? { ...item, [type]: parseInt(value) } : item)));
  };

  const handleResult = () => {
    navigate("/results");
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
          Do you want to hear this at a Rainy Day?
        </h1>
        <div className="selection-content__element-buttons">
          {rainyData.map((ele, index) => (
            <div key={ele} className={ele} onMouseEnter={() => handleMouseEnter(ele)} onMouseLeave={handleMouseLeave}>
              <button className={`selection-content__element-buttons--button ${selectedElements[index].selected ? "selected" : ""}`} onClick={() => toggleElementSelection(index)}>
                {ele.replace("-", " ")}
              </button>
              {selectedElements[index].selected && (
                <div className="selection-content__controls">
                  <p>Volume:</p>
                  <input type="range" min="0" max="100" value={selectedElements[index].volume} onChange={(e) => handleSliderChange(index, "volume", e.target.value)} />
                  <p>Intensity:</p>
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
