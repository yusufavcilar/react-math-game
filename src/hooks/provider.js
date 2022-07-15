import { useState, createContext, useEffect } from "react";

export const Context = createContext();

const randomNumber = () => Math.floor(Math.random() * 8 + 2);

const getSqrt = (a, b) => Math.ceil(Math.sqrt(a * b));

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const Provider = ({ children }) => {
  const [tour, setTour] = useState(0);
  const [questionsArr, setQuestionsArr] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [currentNumber, setCurrentNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [backGroundColor, setBackGroundColor] = useState("#2d2d2d");
  const [isClick, setIsClick] = useState(false);
  const [clickBtnId, setClickBtnId] = useState(null);
  const [resultQuestions, setResultQuestions] = useState([]);
  const [trueAnswerCount, setTrueAnswerCount] = useState(0);
  const [totalResult, setTotalResult] = useState({
    totalScore: 0,
    totalQuestions: 0,
    correctAnswers: 0,
  });

  const setAllQuestion = () => {
    const newArr = [];
    setCurrentNumber(0);
    setResultQuestions([]);

    for (let i = 0; i < 10; i++) {
      const numA = randomNumber();
      const numB = randomNumber();
      const scorePoint = getSqrt(numA, numB);
      const trueAnswer = numA * numB;
      const answerObj = {
        a1: numA * numB,
        a2: (numA + 1) * numB,
        a3: numA * (numB - 1),
      };
      let answerArr = Object.values(answerObj);
      answerArr = shuffleArray(answerArr);

      newArr.push({
        numA,
        numB,
        scorePoint,
        trueAnswer,
        answerArr,
        result: null,
      });
    }
    setCurrentQuestion(newArr[currentNumber]);
    setQuestionsArr(newArr);
  };

  const checkAnswer = (answer, btnId) => {
    const isTrue = answer === currentQuestion.trueAnswer;
    const resultQuestionText = `${currentQuestion.numA} x ${currentQuestion.numB} = ${currentQuestion.trueAnswer}`;
    setIsClick(true);
    setClickBtnId(btnId);

    if (isTrue) {
      setResultQuestions([
        ...resultQuestions,
        {
          resultQuestionText,
          isAnswerTrue: true,
        },
      ]);
      setTrueAnswerCount(trueAnswerCount + 1);
      setBackGroundColor("green");
    } else {
      setResultQuestions([
        ...resultQuestions,
        {
          resultQuestionText,
          isAnswerTrue: false,
        },
      ]);
      setBackGroundColor("red");
    }

    setTimeout(() => {
      if (isTrue) {
        setScore(score + currentQuestion.scorePoint);
      }
      setBackGroundColor("#2d2d2d");
      setCurrentNumber(currentNumber + 1);
      setClickBtnId(null);
      setIsClick(false);
    }, 3000);
  };

  const setTotalResultToStorage = (data) => {
    if (data) {
      setTotalResult(data);
    } else {
      setTotalResult((prevState) => ({
        ...prevState,
        totalScore: prevState.totalScore + score,
        totalQuestions: prevState.totalQuestions + questionsArr.length,
        correctAnswers: prevState.correctAnswers + trueAnswerCount,
      }));
    }
  };

  useEffect(() => {
    if (questionsArr.length > 0) {
      setCurrentQuestion(questionsArr[currentNumber]);
    }
  }, [currentNumber]);

  useEffect(() => {
    localStorage.setItem("totalResult", JSON.stringify(totalResult));
  }, [totalResult]);

  useEffect(() => {
    localStorage.setItem("tour", JSON.stringify(tour));
  }, [tour]);

  return (
    <Context.Provider
      value={{
        tour,
        questionsArr,
        score,
        currentQuestion,
        isClick,
        currentNumber,
        backGroundColor,
        clickBtnId,
        resultQuestions,
        trueAnswerCount,
        totalResult,
        setTour,
        checkAnswer,
        setAllQuestion,
        setTotalResultToStorage,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
