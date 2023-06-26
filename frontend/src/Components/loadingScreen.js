import { GiBirdTwitter } from "react-icons/gi";
function LoadingScreen() {
  return (
    <main className="loading-screen">
      <div className="logo">
        <GiBirdTwitter />
      </div>
      <span className="loading-text">Fetching Data, Please Wait!</span>
    </main>
  );
}

export default LoadingScreen;
