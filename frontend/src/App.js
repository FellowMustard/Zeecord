import axios from "axios";
import { testingUrl } from "./api/fetchLinks";
function App() {
  const handleButton = async () => {
    const { data } = await axios.get(testingUrl);
    console.log(data);
  };
  return (
    <div className="App">
      haha
      <button onClick={() => handleButton()}>ping me!</button>
    </div>
  );
}

export default App;
