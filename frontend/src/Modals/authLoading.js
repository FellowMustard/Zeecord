import { AiOutlineLoading3Quarters } from "react-icons/ai";
function AuthLoading() {
  return (
    <main className="modal-bg transparent">
      <div className="modal-box-loading">
        <span>Processing, Please Wait!</span>
        <AiOutlineLoading3Quarters className="loading" />
      </div>
    </main>
  );
}

export default AuthLoading;
