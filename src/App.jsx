import React, { useState, useRef, useEffect } from "react";
import "./index.css";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Timer from "./component/Timer";
import InputBox from "./component/InputBox";
import Result from "./component/Result";
import Message from "./component/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo } from "@fortawesome/free-solid-svg-icons";

// const wordsList = [
//   "DeepSeek", "hello", "world", "this", "is", "a", "test", "for",
//   "keyClash", "typing", "texting", "example", "coding",
//   "html", "css", "SAS", 'PHP', "React", "Docker", "GPT", "AI", "ML",
//   "DL", "Python", "JavaScript",
// ];

const App = () => {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [time, setTime] = useState(35);
  const [showResult, setShowResult] = useState(false);
  const [showResultData, setShowResultData] = useState(null);
  const timeRef = useRef(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const completionSound = new Audio("/sounds/click_2.mp3");

  const shuffleWords = (words) => [...words].sort(() => Math.random() - 0.5);

  // random words
  // key = 1GuaFiOFZO0XUf9Qozu9bA==1mwCnKVrYlSpeS6l
  useEffect(() => {
    const fetchWords = async () => {
      try {
        // Fetch all words from the API
        // const response = await fetch("https://679de442946b0e23c0620582.mockapi.io/random-words/words");
        const response = await fetch("https://amankumar9958.github.io/random-words-api/words.json");
        const data = await response.json();

        // Check if data is an array and has content
        if (Array.isArray(data) && data.length > 0) {
          // Shuffle the array and pick the first 15 words
          const selectedWords = data
            .sort(() => 0.5 - Math.random()) // Shuffle array
            .slice(0, 20); // Take the first 15 words

          // Set the state with the selected words
          setWords(selectedWords.map((item) => item.Word)); // Extract "Word" property
        } else {
          console.warn("No words found in API response.");
        }
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };

    fetchWords(); // Call the function
  }, []);
  
  
  
  

  const startTest = () => {
    setWords(shuffleWords(words));
    setShowResult(false);
    setTimerStarted(false);
    setTime(35);
    setShowResultData(null);
    setStartTime(Date.now());
    clearInterval(timeRef.current);
  };

  const startTimer = () => {
    if (!timerStarted) {
      setTimerStarted(true);
      setStartTime(Date.now());
      timeRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timeRef.current);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  };

  const handleComplete = (correct, incorrect, total) => {
    clearInterval(timeRef.current);
    completionSound.play().catch(() => {});
    const elapsedTime = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    setShowResult(true);
    setShowResultData({ correct, incorrect, total, elapsedTime });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-8 text-blue-400">
          Enhance Your Typing Skills
        </h1>
        {!showResult ? (
          <div className="w-full max-w-3xl p-8 bg-gray-800 rounded-xl shadow-2xl flex flex-col gap-6">
            <Timer time={time} />
            <InputBox
              words={words}
              onComplete={handleComplete}
              startTimer={startTimer}
              timeLeft={time}
            />
            <Message />
            <div className="tooltip mt-4 w-fit m-auto flex justify-center items-center cursor-pointer">
              <button
                onClick={startTest}
                className="px-6 py-3 text-gray-900 rounded-lg bg-blue-400 hover:bg-blue-500 transition-all flex justify-center items-center w-fit m-auto cursor-pointer"
              >
                <FontAwesomeIcon icon={faRedo} className="text-xl" />
              </button>
              <span className="tooltiptext">Reload</span>
            </div>
          </div>
        ) : (
          <Result {...showResultData} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;