import { useEffect, useRef, useState } from "react";
import MovingBg from "../Components/MovingBg";
import { IoMdInformationCircle } from "react-icons/io";
import { GiBirdTwitter } from "react-icons/gi";
import { AiFillGithub, AiFillWarning } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import DateTimePicker from "../Components/dateTimePicker";

import axios from "axios";

function Home() {
  const [isLogin, setIsLogin] = useState(false);

  const changePagesToLogin = (action) => {
    setIsLogin(action);
  };
  return (
    <main className="main-bg">
      <MovingBg />
      <span className="app-title">
        <GiBirdTwitter className="logo" />
        <span>Zeecord</span>
      </span>
      <AnimatePresence>
        {isLogin ? (
          <Login key="login" changePagesToLogin={changePagesToLogin} />
        ) : (
          <Register key="register" changePagesToLogin={changePagesToLogin} />
        )}
      </AnimatePresence>

      <a className="github-href">
        <AiFillGithub className="logo" />
      </a>
    </main>
  );
}

function Login() {
  const [errMsg, useErrMsg] = useState("");
  return (
    <motion.form
      exit={{ opacity: 0, y: -200, transition: { duration: 0.2 } }}
      initial={{
        opacity: 0,
        y: -200,
      }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.3,
          duration: 0.4,
          type: "spring",
          stiffness: 800,
          damping: 30,
        },
      }}
      className="login-card"
    >
      <h4 className="card-title">Welcome back!</h4>
      <p className="card-subtitle">We're so exited to see you again</p>
    </motion.form>
  );
}

function Register({ changePagesToLogin }) {
  const USER_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9_ ]{2,23}[a-zA-Z0-9]$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const emailRef = useRef();
  const userRef = useRef();
  const passRef = useRef();

  const [email, setEmail] = useState("");
  const [focusEmail, setFocusEmail] = useState(false);
  const [validEmail, setValidEmail] = useState(false);

  const [username, setUsername] = useState("");
  const [focusUsername, setFocusUsername] = useState(false);
  const [validUsername, setValidUsername] = useState(false);

  const [password, setPassword] = useState("");
  const [focusPassword, setFocusPassword] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const [dob, setDOB] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [errAnimation, setErrAnimation] = useState(false);

  const handleDOB = (DOB) => {
    if (DOB) {
      setDOB(DOB);
    } else {
      setDOB("");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validEmail) {
      setErrAnimation(true);
      setErrMsg("Please Use Valid Email Address!");
      emailRef.current.focus();
      return;
    }
    if (!validUsername) {
      setErrAnimation(true);
      setErrMsg("Please Use Valid Username Format!");
      userRef.current.focus();
      return;
    }
    if (!validPassword) {
      setErrAnimation(true);
      setErrMsg("Please Use Valid Password Format!");
      passRef.current.focus();
      return;
    }
    if (!dob) {
      setErrAnimation(true);
      setErrMsg("Please Fill in the Date of Birth!");
      return;
    }

    // await axios
    //   .post(registerUrl, {
    //     username,
    //     email,
    //     password,
    //     dob,
    //   })
    //   .then((response) => console.log(response))
    //   .catch((error) => {
    //     setErrAnimation(true);
    //     setErrMsg(error.response.data.message);
    //     if (error.response.status === 409) {
    //       emailRef.current.focus();
    //     }
    //   });
  };

  useEffect(() => {
    if (errAnimation) {
      const timeoutId = setTimeout(() => {
        setErrAnimation(false);
      }, 2500);

      return () => clearTimeout(timeoutId);
    }
  }, [errAnimation]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = USER_REGEX.test(username);
    setValidUsername(result);
  }, [username]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPassword(result);
  }, [password]);

  return (
    <motion.form
      exit={{ opacity: 0, y: 200, transition: { duration: 0.2 } }}
      initial={{
        opacity: 0,
        y: 200,
      }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.3,
          duration: 0.4,
          type: "spring",
          stiffness: 800,
          damping: 30,
        },
      }}
      className="reg-card"
      autoComplete="off"
      onSubmit={(e) => {
        handleRegister(e);
      }}
      noValidate
    >
      <h4 className="card-title">Create an account</h4>
      <div className="cred-tab">
        <p>EMAIL</p>
        <input
          ref={emailRef}
          type="text"
          className="cred-input dark"
          name="email"
          autoComplete="off"
          required
          onFocus={() => setFocusEmail(true)}
          onBlur={() => setFocusEmail(false)}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div
          className={`instruction small ${
            !validEmail && focusEmail ? "open" : ""
          }`}
        >
          <IoMdInformationCircle />
          <span className="instruction-desc">
            Please Enter a Valid Email Address!
          </span>
        </div>
      </div>
      <div className="cred-tab">
        <p>USERNAME</p>
        <input
          ref={userRef}
          type="text"
          className="cred-input dark"
          name="email"
          autoComplete="off"
          required
          onFocus={() => setFocusUsername(true)}
          onBlur={() => setFocusUsername(false)}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div
          className={`instruction big ${
            !validUsername && focusUsername ? "open" : ""
          }`}
        >
          <IoMdInformationCircle />
          <span className="instruction-desc">
            The Username Must be Between 4-25 Characters and Can Only Contain
            Alphanumeric and Underscore (A-Z 0-9 _). The First and Last
            Character Must be Alphanumeric (A-Z 0-9).
          </span>
        </div>
      </div>
      <div className="cred-tab">
        <p>PASSWORD</p>
        <input
          ref={passRef}
          type="password"
          className="cred-input dark"
          name="password"
          autoComplete="off"
          required
          onFocus={() => setFocusPassword(true)}
          onBlur={() => setFocusPassword(false)}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div
          className={`instruction big ${
            !validPassword && focusPassword ? "open" : ""
          }`}
        >
          <IoMdInformationCircle />
          <span className="instruction-desc">
            The Password Must be 8-24 Characters, it Must Contain at Least One
            Upper Case Character(A-Z), Lower Case Character(a-z), and
            Number(0-9).
          </span>
        </div>
      </div>
      <div className="cred-tab">
        <p>DATE OF BIRTH</p>
        <DateTimePicker handleDOB={handleDOB} />
      </div>
      <div className="cred-tab flex-row">
        <input type="checkbox" className="checkmark"></input>
        <p>
          (Optional) It’s okay to send me emails with Zeecord updates, tips, and
          special offers. You can opt out at any time.
        </p>
      </div>
      <div className="cred-tab">
        <div className="error-section">
          {errMsg && errAnimation ? (
            <motion.div
              animate={{ x: [-10, 10, -10, 10, -5, 5, -2, 2, 0] }}
              transition={{ duration: 0.5 }}
              className="error-box"
            >
              <AiFillWarning className="logo" />
              <span>{errMsg}</span>
            </motion.div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="cred-tab">
        <button type="submit" className="login-button">
          Continue
        </button>
      </div>
      <p className="card-smalltext">
        <span
          className="welcome-hyperlink"
          onClick={() => changePagesToLogin(true)}
          style={{ marginLeft: "5px" }}
        >
          Already Have an account?
        </span>
      </p>
    </motion.form>
  );
}

export default Home;
