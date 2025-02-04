import React, { useState, useEffect, useRef } from "react";

const InputBox = ({ timeLeft, words, onComplete, startTimer }) => {
  const [userInput, setUserInput] = useState("");
  const [correctCharacters, setCorrectCharacters] = useState(0);
  const [incorrectCharacters, setIncorrectCharacters] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typingStopped, setTypingStopped] = useState(false);

  const keypressSound = useRef(null);

  useEffect(() => {
    keypressSound.current = new Audio("public/sounds/click_2.mp3");
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !typingStopped) {
      setTypingStopped(true);

      let finalCorrect = correctCharacters;
      let finalIncorrect = incorrectCharacters;

      if (currentWordIndex < words.length) {
        const currentWord = words[currentWordIndex];
        const trimmedInput = userInput.trim();
        const { correctChars, incorrectChars } = calculateCharacterCounts(trimmedInput, currentWord);

        finalCorrect += correctChars;
        finalIncorrect += incorrectChars;
      }

      const totalChars = words.reduce((sum, word) => sum + word.length, 0);
      onComplete(finalCorrect, finalIncorrect, totalChars);
    }
  }, [timeLeft, typingStopped]);

  const handleInputChange = (e) => {
    if (timeLeft === 0) return;

    const inputValue = e.target.value;
    setUserInput(inputValue);

    if (inputValue.length === 1 && timeLeft > 0) {
      startTimer();
    }

    if (keypressSound.current && inputValue.length > 0) {
      keypressSound.current.play().catch(() => {});
    }
  };

  const calculateCharacterCounts = (trimmedInput, currentWord) => {
    let correctChars = 0;
    let incorrectChars = 0;

    for (let i = 0; i < currentWord.length; i++) {
      if (trimmedInput[i] === currentWord[i]) {
        correctChars++;
      } else if (i < trimmedInput.length) {
        incorrectChars++;
      }
    }

    incorrectChars += Math.max(0, trimmedInput.length - currentWord.length);
    return { correctChars, incorrectChars };
  };

  const handleKeyDown = (e) => {
    if (e.key === " " && timeLeft > 0) {
      e.preventDefault();

      if (currentWordIndex >= words.length) return;

      const trimmedInput = userInput.trim();
      const currentWord = words[currentWordIndex];
      const { correctChars, incorrectChars } = calculateCharacterCounts(trimmedInput, currentWord);

      setCorrectCharacters(prev => prev + correctChars);
      setIncorrectCharacters(prev => prev + incorrectChars);

      const isLastWord = currentWordIndex + 1 >= words.length;
      if (isLastWord) {
        const totalChars = words.reduce((sum, word) => sum + word.length, 0);
        onComplete(correctCharacters + correctChars, incorrectCharacters + incorrectChars, totalChars);
      }

      setCurrentWordIndex(prev => prev + 1);
      setUserInput("");
    }
  };

  return (
    <div className="w-full">
      <div className="text-xl mb-6 text-gray-300 font-mono">
        {words.length === 0 ? (
          <p className="text-center">Loading words from API...</p>
        ) : (
          words.map((word, index) => (
            <span
              key={index}
              className={index === currentWordIndex ? "text-blue-400" : "text-gray-300"}
            >
              {word}{" "}
            </span>
          ))
        )}
      </div>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={timeLeft === 0 || currentWordIndex >= words.length}
        className="p-3 w-full bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400 transition-colors text-lg"
        placeholder="Start typing here..."
      />
    </div>
  );
};

export default InputBox;
