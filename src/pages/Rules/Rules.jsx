import "./Rules.css";
import { useEffect, useState } from "react";

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Lobby() {
  const [isMobile, setIsMobile] = useState(false);
  const [rectangles, setRectangles] = useState([]);

  useEffect(() => {
    const newRectangles = [];
    const numberOfRectangles = 15;
    for (let i = 0; i < numberOfRectangles; i++) {
      newRectangles.push({
        top: generateRandomNumber(0, 85),
        right: generateRandomNumber(0, 85),
        width: generateRandomNumber(40, 100),
        height: generateRandomNumber(40, 100),
      });
    }

    setRectangles(newRectangles);
  }, []);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const sections = [
    {
      title: "Welcome to Mr. White",
      text: "A game of secret words, clever hints, and suspicious glances.|Can you spot the imposter before they catch on?",
    },
    {
      title: "How to Play",
      text: "Everyone gets the same secret word — except Mr. White, who gets a similar but slightly different one.|Take turns giving one-word clues that relate to your word!",
    },
    {
      title: "The Verdict",
      text: "After two rounds of clues, vote to eliminate who you think is Mr. White.|If you’re right, you win! If not... keep playing!",
    },
    {
      title: "Pro Tip",
      text: "Mr. White wins if they can guess the secret word before getting caught — so choose your clues wisely!",
    },
  ];

  const title = () => {
    return <h1>Rules</h1>;
  };

  const renderText = (text) => {
    if (isMobile) return text.replaceAll("|", " ");

    return text.split("|").map((sentence, i) => (
      <span key={i}>
        {sentence}
        <br />
      </span>
    ));
  };

  const renderRectangle = () => {
    return (
      <>
        {rectangles.map((rect, index) => (
          <div
            key={index}
            className="decor-rectangle"
            style={{
              top: `${rect.top}%`,
              right: `${rect.right}%`,
              width: `${rect.width}px`,
              height: `${rect.height}px`,
            }}
          ></div>
        ))}
      </>
    );
  };

  const text = () => {
    return (
      <>
        {sections.map((element, index) => (
          <div key={index}>
            <h3>{element.title}</h3>
            <p>{renderText(element.text)}</p>
          </div>
        ))}
      </>
    );
  };

  return (
    <>
      <div className="outer-container">
        {renderRectangle()}
        {title()}
        {text()}
      </div>
    </>
  );
}
