import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  React,
} from "react";
import MovingBg from "../Components/MovingBg";
import { IoMdInformationCircle } from "react-icons/io";
import { GiBirdTwitter } from "react-icons/gi";
import { AiFillGithub, AiFillWarning } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import DateTimePicker from "../Components/dateTimePicker";
import { loginUrl, registerUrl, axios } from "../api/fetchLinks";
import { GetLoading, GetModal, GetToken } from "../Context/userProvider";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLoading from "../Modals/authLoading";
import { SetNewUser } from "../Function/newUser";
import LoadingScreen from "../Components/loadingScreen";

function Home() {
  const [forbidden, setForbidden] = useState(false);
  const location = useLocation();
  const [loading] = GetLoading();

  const [authLoading, setAuthLoading] = useState(false);

  const [isLogin, setIsLogin] = useState(true);

  const memoLink = useMemo(() => {
    return (
      <a
        target="_blank"
        className="github-href"
        href="https://github.com/FellowMustard/zeecord"
      >
        <AiFillGithub className="logo" />
      </a>
    );
  });

  const memoBg = useMemo(() => {
    return <MovingBg />;
  });

  const changePagesToLogin = useCallback((action) => {
    setIsLogin(action);
  }, []);

  useEffect(() => {
    if (location.state?.forbidden) {
      setForbidden(true);
    }
  }, []);

  return loading ? (
    <LoadingScreen />
  ) : (
    <main className="main-bg">
      <div className="empty">{authLoading && <AuthLoading />}</div>
      {memoBg}
      <span className="app-title">
        <GiBirdTwitter className="logo" />
        <span>Zeecord</span>
      </span>
      <AnimatePresence>
        {isLogin ? (
          <Login
            key="login"
            setAuthLoading={setAuthLoading}
            changePagesToLogin={changePagesToLogin}
            forbidden={forbidden}
          />
        ) : (
          <Register
            key="register"
            setAuthLoading={setAuthLoading}
            changePagesToLogin={changePagesToLogin}
          />
        )}
      </AnimatePresence>
      {memoLink}
    </main>
  );
}

function Login({ changePagesToLogin, forbidden, setAuthLoading }) {
  const location = useLocation();
  const [token, setToken] = GetToken();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [errAnimation, setErrAnimation] = useState(false);

  const Navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrAnimation(true);
      setErrMsg("Email Can't be Empty!");
      return;
    }
    if (!password) {
      setErrAnimation(true);
      setErrMsg("Password Can't be Empty!");
      return;
    }

    setAuthLoading(true);

    await axios
      .post(loginUrl, {
        email,
        password,
      })
      .then((response) => {
        setToken(response.data.accessToken);
        setAuthLoading(false);
        SetNewUser(false);
        Navigate(location.state?.location ?? "/channel/@me");
      })
      .catch((error) => {
        setAuthLoading(false);
        setErrAnimation(true);
        setErrMsg(error.response.data.message);
      });
  };
  useEffect(() => {
    if (forbidden) {
      setErrAnimation(true);
      setErrMsg("Please Try to Login Again!");
      return;
    }
  }, []);

  useEffect(() => {
    if (errAnimation) {
      const timeoutId = setTimeout(() => {
        setErrAnimation(false);
      }, 2500);

      return () => clearTimeout(timeoutId);
    }
  }, [errAnimation]);

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
          stiffness: 1000,
          damping: 30,
        },
      }}
      autoComplete="off"
      onSubmit={(e) => {
        handleLogin(e);
      }}
      noValidate
      className="login-card"
    >
      <h4 className="card-title">Welcome back!</h4>
      <p className="card-subtitle">We're so exited to see you again</p>
      <div className="cred-tab">
        <p>
          EMAIL OR PHONE NUMBER <span className="red-font">*</span>
        </p>
        <input
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          className="cred-input"
          name="email"
        ></input>
      </div>
      <div className="cred-tab">
        <p>
          PASSWORD <span className="red-font">*</span>
        </p>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="cred-input"
          name="password"
        ></input>
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
        Need an account?
        <span
          className="welcome-hyperlink"
          onClick={() => changePagesToLogin(false)}
          style={{ marginLeft: "5px" }}
        >
          Register
        </span>
      </p>
    </motion.form>
  );
}

function Register({ changePagesToLogin, setAuthLoading }) {
  const location = useLocation();

  const [modal, setModal] = GetModal();
  const currModal = { ...modal };
  const [token, setToken] = GetToken();

  const Navigate = useNavigate();

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
    setAuthLoading(true);
    await axios
      .post(registerUrl, {
        username,
        email,
        password,
        dob,
      })
      .then((response) => {
        setAuthLoading(false);
        setToken(response.data.accessToken);
        SetNewUser(true);
        Navigate(location.state?.location ?? "/channel/@me");
      })
      .catch((error) => {
        setAuthLoading(false);
        setErrAnimation(true);
        setErrMsg(error.response.data.message);
        if (error.response.status === 409) {
          emailRef.current.focus();
        }
      });
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
          stiffness: 1000,
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
