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
  const baseAmb = `/assets/sound/${environment.name}.wav`;

  const initialElements = elements.map((name) => ({
    name,
    selected: false,
    volume: 50,
    frequency: 50,
  }));

  const [activeBackground, setActiveBackground] = useState("");
  const [selectedElements, setSelectedElements] = useState(initialElements);
  const [isAmbPlaying, setIsAmbPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const amb = useRef(null);
  const topLayerSounds = useRef([]);
  const topLayerInterval = useRef([]);

  //get all the src url for all the elements, in object with key as element name
  const topElements = {};
  environment.elements.forEach((element) => {
    topElements[element.name] = Array.from({ length: element.file_num }, (_, index) => `/assets/sound/${element.name}/${element.name}_${index + 1}.mp3`);
  });

  useEffect(() => {
    amb.current = new Howl({
      src: [baseAmb],
      //autoplay: true,
      preload: true,
      loop: true,
      volume: volume,
    });

    return () => {
      elements.forEach((_, index) => {
        if (topLayerSounds.current[index]) {
          topLayerSounds.current[index].forEach((sound) => sound.stop());
          clearTimeout(topLayerInterval.current[index]);
        }
      });
      if (amb.current) amb.current.stop();
    };
  }, []);

  const playPauseHandler = () => {
    if (isAmbPlaying) {
      amb.current.pause();
    } else {
      amb.current.play();
    }
    setIsAmbPlaying(!isAmbPlaying);
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
      scheduleTopLayerSounds(index);
    } else {
      if (topLayerSounds.current[index]) {
        topLayerSounds.current[index].forEach((sound) => sound.stop());
        clearTimeout(topLayerInterval.current[index]);
        topLayerSounds.current[index] = null;
      }
    }
  };

  const scheduleTopLayerSounds = (index) => {
    const elementName = elements[index];
    topLayerSounds.current[index] = topElements[elementName].map(
      (src) =>
        new Howl({
          src: [src],
          volume: selectedElements[index].volume / 100,
        })
    );

    playRandomTopLayer(index);
  };

  const playRandomTopLayer = (index) => {
    if (!topLayerSounds.current[index] || topLayerSounds.current[index].length === 0) {
      console.error("Sound files are not loaded or initialized properly");
      return;
    }
    const sounds = topLayerSounds.current[index];
    const randomIndex = Math.floor(Math.random() * sounds.length);
    const sound = sounds[randomIndex];

    sound.play();

    // Schedule the next sound to play after current ends
    sound.once("end", () => {
      if (selectedElements[index].selected) {
        const interval = convertSliderValue(selectedElements[index].frequency);
        topLayerInterval.current[index] = setTimeout(() => playRandomTopLayer(index), interval);
      }
    });
  };

  const convertSliderValue = (value) => {
    const maxInterval = 5 * 60 * 1000; // 5 minutes
    const minInterval = 5 * 1000; // 5 sec
    return (maxInterval - minInterval) * (1 - value / 100) + minInterval;
  };

  const handleSliderChange = (index, type, value) => {
    const updatedElements = selectedElements.map((item, idx) => (idx === index ? { ...item, [type]: parseInt(value) } : item));
    setSelectedElements(updatedElements);

    if (type === "volume" && topLayerSounds.current[index]) {
      topLayerSounds.current[index].forEach((sound) => {
        sound.volume(value / 100);
      });
    }

    if (type === "frequency") {
      // Resetting the interval whenever the frequency changes
      clearTimeout(topLayerInterval.current[index]);
      const interval = convertSliderValue(value);
      topLayerInterval.current[index] = setTimeout(() => playRandomTopLayer(index), interval);
    }
  };

  const handleResult = () => {
    navigate("/");
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
