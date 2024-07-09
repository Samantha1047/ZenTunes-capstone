import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Howl, Howler } from "howler";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./ElementSelectionPage.scss";

const ElementSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { environment } = location.state || {};
  const elements = environment ? environment.elements.map((element) => element.name) : [];
  const baseAmb = `/assets/sound/${environment.name}.mp3`;

  const initialElements = elements.map((name) => ({
    name,
    selected: false,
    volume: 50,
    frequency: 50,
  }));

  const [activeBackground, setActiveBackground] = useState("");
  const [sound, setSound] = useState(null);
  const [selectedElements, setSelectedElements] = useState(initialElements);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const amb = useRef(null);
  const topLayerSounds = useRef(null);

  //get all the src url for all the elements, in object with key as element name
  const topElements = {};
  environment.elements.forEach((element) => {
    topElements[element.name] = Array.from({ length: element.file_num }, (_, index) => `/assets/sound/${element.name}/${element.name}_${index + 1}.mp3`);
  });

  useEffect(() => {
    amb.current = new Howl({
      src: [baseAmb],
      loop: true,
      volume: volume,
    });

    return () => {
      amb.current.stop();
    };
  }, []);

  const playPauseHandler = () => {
    if (isPlaying) {
      amb.current.pause();
    } else {
      amb.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMouseEnter = (element) => {
    setActiveBackground(element);
  };

  const handleMouseLeave = () => {
    setActiveBackground("");
  };

  const toggleElementSelection = (index, element) => {
    const isSelected = selectedElements[index].selected;

    setSelectedElements(selectedElements.map((item, idx) => (idx === index ? { ...item, selected: !item.selected } : item)));

    if (!isSelected) {
      topLayerSounds.current = topElements[element].map((src) => new Howl({ src: [src], volume: 0.5 }));

      const randomIndex = Math.floor(Math.random() * topLayerSounds.current.length);
      const sound = topLayerSounds.current[randomIndex];
      sound.play();
      setSound(sound);
    } else {
      sound.stop();
      setSound(null);
    }
  };

  const handleSliderChange = (index, type, value) => {
    const updatedElements = selectedElements.map((item, idx) => (idx === index ? { ...item, [type]: parseInt(value) } : item));
    setSelectedElements(updatedElements);

    if (type === "volume" && sound) {
      sound.volume(value / 100);
    }
  };

  const handleResult = () => {
    navigate("/results", { state: { environment, selectedElements } });
  };

  return (
    <div className={`element-selection element-selection--${environment.name}`}>
      <Header />
      <video autoPlay loop muted playsInline className="element-selection__background-video">
        <source src={`/assets/videos/${environment.name}.mp4`} type="video/mp4" />
      </video>
      {activeBackground && (
        <video autoPlay loop muted playsInline className="element-selection__background-video">
          <source src={`/assets/videos/${activeBackground}.mp4`} type="video/mp4" />
        </video>
      )}
      <main className="selection-content">
        <h1 className={activeBackground ? `selection-content__background-active--${activeBackground}` : "selection-content__background-active"}>
          Do you want to hear this {environment.envPhase}?
        </h1>
        <p className="selection-content__instruction">Click to Select and Start Mixing!</p>
        <button className="element-selection__pause" onClick={playPauseHandler}>
          <img src="/assets/images/play_pause.svg" />
          {environment.envWord}
        </button>
        <div className="selection-content__element-buttons">
          {elements.map((ele, index) => (
            <div key={ele} className={ele} onMouseEnter={() => handleMouseEnter(ele)} onMouseLeave={handleMouseLeave}>
              <button
                className={`selection-content__element-buttons--button ${selectedElements[index].selected ? "selected" : ""}`}
                onClick={() => toggleElementSelection(index, ele)}>
                {ele.replace("-", " ")}
              </button>
              {selectedElements[index].selected && (
                <div className="selection-content__controls">
                  <p>Volume:</p>
                  <input type="range" min="0" max="100" value={selectedElements[index].volume} onChange={(e) => handleSliderChange(index, "volume", e.target.value)} />
                  <p>Frequency:</p>
                  <input type="range" min="0" max="100" value={selectedElements[index].frequency} onChange={(e) => handleSliderChange(index, "frequency", e.target.value)} />
                </div>
              )}
            </div>
          ))}
        </div>
        <button className="element-selection__try-again" onClick={handleResult}>
          Try Another Soundscape!
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default ElementSelectionPage;
