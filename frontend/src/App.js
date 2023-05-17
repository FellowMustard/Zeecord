import { useState } from "react";
import Home from "./Pages/Home";
import Channel from "./Pages/Channel";
import { Route, Routes, Navigate } from "react-router-dom";
import Join from "./Pages/Join";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/join/:groupLink" element={<Join />} />
        <Route path="/channel/:channelName" element={<Channel />} />
      </Routes>
    </>
  );
}

export default App;
