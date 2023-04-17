import { useState } from "react";
import Home from "./Pages/Home";
import Channel from "./Pages/Channel";
import { Route, Routes, Navigate } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} exact></Route>
        <Route exact path="/channel" element={<Channel />} />
      </Routes>
    </>
  );
}

export default App;
