import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Howl } from "howler";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import VolumeSlider from "../../components/VolumeSlider/VolumeSlider";
import ElementSlider from "../../components/ElementSlider/ElementSlider";
import PlayCircleFilledOutlinedIcon from "@mui/icons-material/PlayCircleFilledOutlined";
import PauseCircleFilledOutlinedIcon from "@mui/icons-material/PauseCircleFilledOutlined";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import HelpIcon from "@mui/icons-material/Help";
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
  const [hoveredElementIndex, setHoveredElementIndex] = useState(null);
  const amb = useRef(null);
  const topLayerSounds = useRef([]);
  const topLayerInterval = useRef([]);
  const hoverSound = useRef(null);

  //get all the src url for all the elements, in object with key as element name
  const topElements = {};
  environment.elements.forEach((element) => {
    topElements[element.name] = Array.from({ length: element.file_num }, (_, index) => `/assets/sound/${element.name}/${element.name}_${index + 1}.mp3`);
  });

  useEffect(() => {
    amb.current = new Howl({
      src: [baseAmb],
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
      if (hoverSound.current) hoverSound.current.stop();
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

  const handleMouseEnter = (element, index) => {
    setActiveBackground(element);
    if (!selectedElements[index].selected) {
      playHoverSound(element);
    }
  };

  const handleMouseEnterIcon = (index) => {
    setHoveredElementIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveBackground("");
    if (hoverSound.current) {
      hoverSound.current.stop();
      hoverSound.current = null;
    }
  };

  const handleMouseLeaveIcon = () => {
    setHoveredElementIndex(null);
  };

  const toggleElementSelection = (index) => {
    const isSelected = selectedElements[index].selected;
    const updatedElements = selectedElements.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          selected: !item.selected,
          // Reset volume and frequency to 50 when deselected
          volume: !item.selected ? 50 : item.volume,
          frequency: !item.selected ? 50 : item.frequency,
        };
      }
      return item;
    });
    setSelectedElements(updatedElements);

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
    const maxInterval = 3 * 60 * 1000; // 3 minutes
    const minInterval = 0; // 0 sec
    const baseInterval = (maxInterval - minInterval) * (1 - value / 100) + minInterval;
    const randomRange = 10 * 1000; // 10 sec
    //add +-10 sec to give more variety to the time interval
    const randomTimeRange = Math.floor(Math.random() * randomRange) - randomRange / 2;
    return Math.max(baseInterval + randomTimeRange, 0);
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

  const volumeChangeHandler = (e) => {
    setVolume(e.target.value);
    amb.current.volume(e.target.value);
  };

  const playHoverSound = (element) => {
    const sounds = topElements[element];
    if (sounds && sounds.length > 0) {
      const randomIndex = Math.floor(Math.random() * sounds.length);
      hoverSound.current = new Howl({
        src: [sounds[randomIndex]],
        volume: 0.5,
      });
      hoverSound.current.play();
    }
  };

  const handleResult = () => {
    navigate("/");
  };

  return (
    <div className={`element-selection element-selection--${environment.name}`}>
      <Header />

      <video autoPlay loop muted playsInline className="element-selection__background-video-env">
        <source src={`/assets/videos/${environment.name}.mp4`} type="video/mp4" />
      </video>

      {activeBackground && (
        <video autoPlay loop muted playsInline className="element-selection__background-video">
          <source src={`/assets/videos/${activeBackground}.mp4`} type="video/mp4" />
        </video>
      )}

      <main className={`selection-content selection-content--${environment.name}`}>
        <div
          className={activeBackground ? `selection-content__background-active selection-content__background-active--${activeBackground}` : "selection-content__background-active"}>
          <h1>Do you want to hear this {environment.envPhase}?</h1>
          <p className="selection-content__instruction">
            <AdsClickIcon /> Hover to Preview
          </p>
          <p className="selection-content__instruction--phase">Click Button to Select and Start Mixing!</p>
          <div className="selection-content__amb-controls">
            <button className="selection-content__pause" onClick={playPauseHandler}>
              {isAmbPlaying ? (
                <PauseCircleFilledOutlinedIcon style={{ cursor: "pointer", fontSize: "3rem" }} />
              ) : (
                <PlayCircleFilledOutlinedIcon style={{ cursor: "pointer", fontSize: "3rem" }} />
              )}
              {environment.envWord}
            </button>
            <div className={isAmbPlaying ? "selection-content__volume" : " selection-content__volume selection-content__volume--hiddlen"}>
              <VolumeSlider location={environment.name} volume={volume} volumeChangeHandler={volumeChangeHandler} />
            </div>
          </div>
        </div>
        <div className="selection-content__element-buttons">
          {elements.map((ele, index) => (
            <div key={ele} className={`selection-content__button-container selection-content__button-container-${ele}`}>
              <button
                onMouseEnter={() => handleMouseEnter(ele, index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => toggleElementSelection(index, ele)}
                className={`selection-content__element-buttons--button ${selectedElements[index].selected ? "selected" : ""}`}>
                {ele.replace("-", " ")}
              </button>
              {selectedElements[index].selected && (
                <div className="selection-content__controls">
                  <p>Volume:</p>
                  <ElementSlider
                    location={environment.name}
                    value={selectedElements[index].volume}
                    type={"volume"}
                    valueChangeHandler={(e) => handleSliderChange(index, "volume", e.target.value)}
                  />
                  <div className="selection-content__occurrence-label">
                    <div onMouseEnter={() => handleMouseEnterIcon(index)} onMouseLeave={handleMouseLeaveIcon}>
                      <HelpIcon />
                    </div>
                    {hoveredElementIndex === index && <div className="selection-content__occurrence-label--message">How often would you like to hear this element?</div>}
                    <p>Occurrence:</p>
                  </div>

                  <ElementSlider
                    location={environment.name}
                    value={selectedElements[index].frequency}
                    type={"frequency"}
                    valueChangeHandler={(e) => handleSliderChange(index, "frequency", e.target.value)}
                  />
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
