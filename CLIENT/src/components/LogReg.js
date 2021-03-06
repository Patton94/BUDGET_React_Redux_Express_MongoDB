import React, { useState, useMemo, useEffect } from "react";
import "./LogReg.scss";
import { USER_LOGIN, USER_LOGOUT } from "../actionTypes";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { GrClose } from "react-icons/gr";
import { FiLogIn } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { FiUserPlus } from "react-icons/fi";
import Loading from "./Loading";

const Register = () => {
  const { t } = useTranslation();
  const language = localStorage.getItem("i18nextLng");
  const theme = useSelector((state) => state.theme.theme);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
  }, [width]);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Login state //
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginEmailError, setLoginEmailError] = useState("");
  const [loginPasswordError, setLoginPasswordError] = useState("");
  const [acceptedLoginProcessing, setAcceptedLoginProcessing] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  ////

  // Register state //
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerNameError, setRegisterNameError] = useState("");
  const [registerEmailError, setRegisterEmailError] = useState("");
  const [registerPasswordError, setRegisterPasswordError] = useState("");
  const [registerConfirmPasswordError, setRegisterConfirmPasswordError] = useState("");
  const [acceptedRegisterProcessing, setAcceptedRegisterProcessing] = useState(false);
  const [registerFailed, setRegisterFailed] = useState(false);

  ////

  const dispatch = useDispatch();
  const userName = useSelector((state) => state.user.name);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  // Open login modal
  const toggleLogin = () => {
    setIsLoginOpen(!isLoginOpen);
    setIsRegisterOpen(false);
  };

  // Open register modal
  const toggleRegister = () => {
    setIsRegisterOpen(!isRegisterOpen);
    setIsLoginOpen(false);
  };

  // Logout user
  const logout = () => {
    dispatch({
      type: USER_LOGOUT,
    });
  };

  // Login API function
  const loginAPI = () => {
    const userToLog = {
      email: loginEmail,
      password: loginPassword,
    };

    fetch("https://budgetmg.herokuapp.com/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userToLog),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg === "OK") {
          dispatch({
            type: USER_LOGIN,
            payload: data,
          });
          setLoginEmail("");
          setLoginPassword("");
          setAcceptedLoginProcessing(true);
          setTimeout(() => {
            toggleLogin();
            setAcceptedLoginProcessing(false);
            setLoginFailed(false);
          }, 2000);
        } else
          return setLoginFailed(data.msg === "User does not exist" ? data.msg : data.msg);
      });
  };

  // Register API function
  const registerAPI = () => {
    const newUser = {
      name: registerName,
      email: registerEmail,
      password: registerPassword,
    };

    fetch("https://budgetmg.herokuapp.com/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg === "OK") {
          setRegisterName("");
          setRegisterEmail("");
          setRegisterPassword("");
          setRegisterConfirmPassword("");
          setAcceptedRegisterProcessing(true);
          setTimeout(() => {
            toggleRegister();
            setAcceptedRegisterProcessing(false);
            setRegisterFailed(false);
          }, 2000);
        } else return setRegisterFailed(data.msg);
      });
  };

  // MAIN FUNCTION TO LOGIN USER
  const loginUser = (e) => {
    e.preventDefault();
    if (!loginPassword) setLoginPasswordError(t("Common.EmptyError"));
    if (!loginEmail.includes("@")) setLoginEmailError(t("Common.EmailError"));
    if (!loginEmail) setLoginEmailError(t("Common.EmptyError"));

    if (
      loginEmail &&
      loginPassword &&
      loginEmail.includes("@") &&
      !loginEmailError &&
      !loginPasswordError
    ) {
      loginAPI();
    } else return;
  };

  // MAIN FUNCTION TO REGISTER USER
  const registerUser = (e) => {
    e.preventDefault();
    if (registerPassword !== registerConfirmPassword)
      setRegisterConfirmPasswordError(t("Common.ConfirmError"));
    if (!registerName) setRegisterNameError(t("Common.EmptyError"));
    if (!registerEmail.includes("@")) setRegisterEmailError("Incorrect email adress");
    if (!registerEmail) setRegisterEmailError(t("Common.EmptyError"));
    if (!registerPassword) setRegisterPasswordError(t("Common.EmptyError"));
    if (!registerConfirmPassword) setRegisterConfirmPasswordError(t("Common.EmptyError"));

    if (
      registerName &&
      registerEmail &&
      registerPassword &&
      registerConfirmPassword &&
      registerEmail.includes("@") &&
      registerPassword === registerConfirmPassword &&
      !registerNameError &&
      !registerEmailError &&
      !registerPasswordError &&
      !registerConfirmPasswordError
    ) {
      registerAPI();
    }
  };

  // LOGIN
  const memoLogin = useMemo(() => {
    return (
      <div className="logReg__login">
        {isAuthenticated ? (
          <span
            className={theme === "dark" ? "logReg__name dark" : "logReg__name"}
          >{`${userName}`}</span>
        ) : (
          <button
            onClick={toggleLogin}
            className={theme === "dark" ? "logReg__btn dark" : "logReg__btn"}
          >
            {width < 449.98 ? <FiLogIn /> : t("LogReg.NavLogin")}
          </button>
        )}
        <div
          className={
            theme === "dark"
              ? isLoginOpen
                ? "logReg__loginModal active dark"
                : "logReg__loginModal dark"
              : isLoginOpen
              ? "logReg__loginModal active"
              : "logReg__loginModal"
          }
        >
          <div
            className={
              theme === "dark"
                ? isLoginOpen
                  ? "logReg__background active dark"
                  : "logReg__background dark"
                : isLoginOpen
                ? "logReg__background active"
                : "logReg__background"
            }
          >
            <button onClick={toggleLogin} className="logReg__modalClose">
              <GrClose />
            </button>
            <div className="logReg__modalLoading">
              {acceptedLoginProcessing ? <Loading /> : ""}
            </div>
            <div className="logReg__modalMain">
              <div
                className={
                  theme === "dark"
                    ? "logReg__fieldContainer dark"
                    : "logReg__fieldContainer"
                }
              >
                {/* Email */}
                <div className="logReg__labelContainer">
                  <label className="logReg__label">{t("LogReg.Email")}</label>
                </div>
                <div className="logReg__inputContainer">
                  <input
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    onFocus={() => {
                      setLoginEmailError("");
                      setLoginFailed(false);
                    }}
                    type="text"
                    className="logReg__input"
                  />
                </div>
                <div className="logReg__errorContainer">
                  <span className="logReg__error">{loginEmailError}</span>
                </div>
              </div>
              {/* Password */}
              <div
                className={
                  theme === "dark"
                    ? "logReg__fieldContainer dark"
                    : "logReg__fieldContainer"
                }
              >
                <div className="logReg__labelContainer">
                  <label className="logReg__label">{t("LogReg.Password")}</label>
                </div>
                <div className="logReg__inputContainer">
                  <input
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onFocus={() => setLoginPasswordError("")}
                    type="password"
                    className="logReg__input"
                  />
                </div>
                <div className="logReg__errorContainer">
                  <span className="logReg__error">{loginPasswordError}</span>
                </div>
              </div>
            </div>
            {/* Button */}
            <div className="logReg__modalButton">
              <button
                disabled={acceptedLoginProcessing ? true : false}
                onClick={loginUser}
                className="logReg__modalBtn"
              >
                {t("LogReg.LoginBtn")}
              </button>
            </div>
            {/* Message */}
            <div className="logReg__modalMessage">
              <h3>
                {acceptedLoginProcessing
                  ? `${t("LogReg.Hello")} ${userName}`
                  : loginFailed === "User does not exist"
                  ? t("LogReg.UserNotExist")
                  : loginFailed === "Invalid password"
                  ? t("LogReg.InvalidPassword")
                  : ""}
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }, [
    isLoginOpen,
    loginEmail,
    loginPassword,
    loginEmailError,
    loginPasswordError,
    acceptedLoginProcessing,
    loginFailed,
    isAuthenticated,
    language,
    theme,
    width,
  ]);

  // REGISTER
  const memoRegister = useMemo(() => {
    return (
      <div className="logReg__register">
        {isAuthenticated ? (
          <button
            onClick={logout}
            className={theme === "dark" ? "logReg__btn dark" : "logReg__btn"}
          >
            {width < 449.98 ? <FiLogOut /> : t("LogReg.Logout")}
          </button>
        ) : (
          <button
            onClick={toggleRegister}
            className={theme === "dark" ? "logReg__btn dark" : "logReg__btn"}
          >
            {width < 449.98 ? <FiUserPlus /> : t("LogReg.NavRegister")}
          </button>
        )}
        <div
          className={
            theme === "dark"
              ? isRegisterOpen
                ? "logReg__registerModal active dark"
                : "logReg__registerModal dark"
              : isRegisterOpen
              ? "logReg__registerModal active"
              : "logReg__registerModal"
          }
        >
          <div
            className={
              theme === "dark"
                ? isRegisterOpen
                  ? "logReg__background active dark"
                  : "logReg__background dark"
                : isRegisterOpen
                ? "logReg__background active"
                : "logReg__background"
            }
          >
            {/*  */}
            <button onClick={toggleRegister} className="logReg__modalClose">
              <GrClose />
            </button>
            <div className="logReg__modalLoading">
              {acceptedRegisterProcessing ? <Loading /> : ""}
            </div>
            <div className="logReg__modalMain">
              {/* Name */}
              <div
                className={
                  theme === "dark"
                    ? "logReg__fieldContainer dark"
                    : "logReg__fieldContainer"
                }
              >
                <div className="logReg__labelContainer">
                  <label className="logReg__label">{t("LogReg.Name")}</label>
                </div>
                <div className="logReg__inputContainer">
                  <input
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    onFocus={() => setRegisterNameError("")}
                    type="text"
                    className="logReg__input"
                  />
                </div>
                <div className="logReg__errorContainer">
                  <span className="logReg__error">{registerNameError}</span>
                </div>
              </div>
              {/* Email */}
              <div
                className={
                  theme === "dark"
                    ? "logReg__fieldContainer dark"
                    : "logReg__fieldContainer"
                }
              >
                <div className="logReg__labelContainer">
                  <label className="logReg__label">{t("LogReg.Email")}</label>
                </div>
                <div className="logReg__inputContainer">
                  <input
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    onFocus={() => {
                      setRegisterEmailError("");
                      setRegisterFailed(false);
                    }}
                    type="text"
                    className="logReg__input"
                  />
                </div>
                <div className="logReg__errorContainer">
                  <span className="logReg__error">{registerEmailError}</span>
                </div>
              </div>
              {/* Password */}
              <div
                className={
                  theme === "dark"
                    ? "logReg__fieldContainer dark"
                    : "logReg__fieldContainer"
                }
              >
                <div className="logReg__labelContainer">
                  <label className="logReg__label">{t("LogReg.Password")}</label>
                </div>
                <div className="logReg__inputContainer">
                  <input
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    onFocus={() => setRegisterPasswordError("")}
                    type="password"
                    className="logReg__input"
                  />
                </div>
                <div className="logReg__errorContainer">
                  <span className="logReg__error">{registerPasswordError}</span>
                </div>
              </div>
              {/* Confirm password */}
              <div
                className={
                  theme === "dark"
                    ? "logReg__fieldContainer dark"
                    : "logReg__fieldContainer"
                }
              >
                <div className="logReg__labelContainer">
                  <label className="logReg__label">{t("LogReg.ConfirmPassword")}</label>
                </div>
                <div className="logReg__inputContainer">
                  <input
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    onFocus={() => setRegisterConfirmPasswordError("")}
                    type="password"
                    className="logReg__input"
                  />
                </div>
                <div className="logReg__errorContainer">
                  <span className="logReg__error">{registerConfirmPasswordError}</span>
                </div>
              </div>
            </div>
            {/* Button */}
            <div className="logReg__modalButton">
              <button
                disabled={acceptedRegisterProcessing ? true : false}
                onClick={registerUser}
                className="logReg__modalBtn"
              >
                {t("LogReg.RegisterBtn")}
              </button>
            </div>
            {/* Message */}
            <div className="logReg__modalMessage">
              <h3>
                {acceptedRegisterProcessing
                  ? t("LogReg.UserRegistered")
                  : registerFailed
                  ? registerFailed === "User already exists"
                    ? t("LogReg.UserExists")
                    : ""
                  : ""}
              </h3>
            </div>
            {/*  */}
          </div>
        </div>
      </div>
    );
  }, [
    isRegisterOpen,
    registerName,
    registerEmail,
    registerPassword,
    registerConfirmPassword,
    registerNameError,
    registerEmailError,
    registerPasswordError,
    registerConfirmPasswordError,
    acceptedRegisterProcessing,
    registerFailed,
    isAuthenticated,
    language,
    theme,
    width,
  ]);

  return (
    <div className="logReg">
      {memoLogin}
      {memoRegister}
    </div>
  );
};

export default Register;
