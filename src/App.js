import React, { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Game from "./pages/Game.js";
import Home from "./pages/Home.js";
import Result from "./pages/Result.js";
import { Context } from "./hooks/provider.js";

const App = () => {
  const { setTotalResultToStorage, setTour } = useContext(Context);

  useEffect(() => {
    const resultData = JSON.parse(localStorage.getItem("totalResult"));
    const tourData = JSON.parse(localStorage.getItem("tour"));
    if (resultData) {
      setTotalResultToStorage(resultData);
    } else {
      setTotalResultToStorage();
    }

    if (tourData) {
      setTour(tourData);
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<Game />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  );
};

export default App;
