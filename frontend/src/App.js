import { lazy } from "react";

import { Route, Routes } from "react-router-dom";

const Home = lazy(() => import("./Pages/Home"));
const Channel = lazy(() => import("./Pages/Channel"));
const Join = lazy(() => import("./Pages/Join"));

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
