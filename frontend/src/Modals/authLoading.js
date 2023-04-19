import { AiOutlineLoading3Quarters } from "react-icons/ai";
function AuthLoading() {
  return (
    <main className="modal-bg ">
      <div className="modal-box">
        <span>Processing, Please Wait!</span>
        <AiOutlineLoading3Quarters className="loading" />
      </div>
    </main>
  );
}

export default AuthLoading;
