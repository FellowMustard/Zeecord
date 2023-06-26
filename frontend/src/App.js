import { Suspense, lazy } from "react";

import { Route, Routes } from "react-router-dom";
import LoadingScreen from "./Components/loadingScreen";

const Home = lazy(() => import("./Pages/Home"));
const Channel = lazy(() => import("./Pages/Channel"));
const Join = lazy(() => import("./Pages/Join"));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/join/:groupLink" element={<Join />} />
        <Route path="/channel/:channelName" element={<Channel />} />
      </Routes>
    </Suspense>
  );
}

export default App;
