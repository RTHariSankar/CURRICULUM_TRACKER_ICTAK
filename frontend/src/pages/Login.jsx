import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logSvg from "../images/log.svg";
import registerSvg from "../images/register.svg";
import "../styles/Login.css";
import { LOGIN_API, SIGNUP_API } from "../api";

const Login = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});
  const [loginUser, setLoginUser] = useState({});
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    setIsSignUpMode(true);
  };

  const handleSignInClick = () => {
    setIsSignUpMode(false);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Login Input Handler
  const inputHandlerLogin = (e) => {
    if (Object.keys(loginErrors).length > 0) {
      validateLoginFields();
    }
    setLoginUser({
      ...loginUser,
      [e.target.name]: e.target.value,
    });
  };

  // Login Submitted
  const loginHandler = async(e) => {
    e.preventDefault();
    const loginValidationErrors = validateLoginFields();

    if (loginValidationErrors) {
      await axios.post(LOGIN_API, loginUser)
        .then((response) => {
          try {
            if (response.data.message === "Login successful") {
              const token = response.data.token;
              const userId = response.data.data._id;
              const admin = response.data.data.admin;
              sessionStorage.setItem("userToken", token);
              sessionStorage.setItem("userId", userId);
              sessionStorage.setItem("admin", admin);
              alert(response.data.message);
              if (admin) {
                navigate("/admin");
              } else {
                navigate("/faculty");
              }
            } else {
              alert(response.data.message);
            }
          } catch (error) {
            alert(error.response.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      const errorMessages = Object.values(loginErrors).join("\n");
      if (errorMessages.trim() !== "") {
        alert(errorMessages);
      } else {
        alert("Please fill in all the required fields.");
      }
    }
  };

  // Field Validation Login
  const validateLoginFields = () => {
    const { email, password } = loginUser;
    const newLoginErrors = {};
      if (!email) {
        newLoginErrors.loginEmail = "Please enter your email!";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newLoginErrors.loginEmail = "Please enter a valid email address!";
      }
      if (!password) {
        newLoginErrors.loginPassword = "Please enter your password!";
      }

      setLoginErrors(newLoginErrors);

      return Object.keys(newLoginErrors).length === 0;
  };

  // Signup
  const [signInInputs, setSignInInputs] = useState({});
  const [signInErrors, setSignInErrors] = useState({});

  const sinputHandlerSignIn = (e) => {
    if (Object.keys(signInErrors).length > 0) {
      validateFieldsSignIn();
    }
    setSignInInputs({
      ...signInInputs,
      [e.target.name]: e.target.value,
    });
  };

  // const validateFieldsSignIn = () => {
  //   const { name, email, password, confirmPassword } = signInInputs;
  //   const newErrorsSignIn = {};

  //   if (!name) {
  //     newErrorsSignIn.name = "Please enter your name!";
  //   }

  //   if (!email) {
  //     newErrorsSignIn.email = "Please enter your email!";
  //   } else if (!/\S+@\S+\.\S+/.test(email)) {
  //     newErrorsSignIn.email = "Please enter a valid email address!";
  //   }
  //   if (!password) {
  //     newErrorsSignIn.password = "Please enter your password!";
  //   }
  //   if (!confirmPassword) {
  //     newErrorsSignIn.confirmPassword = "Please confirm your password!";
  //   } else if (password !== confirmPassword) {
  //     newErrorsSignIn.confirmPassword = "Passwords do not match!";
  //   }
  //   setSignInErrors(newErrorsSignIn);
  //   return Object.keys(newErrorsSignIn).length === 0;
  // };


  const validateFieldsSignIn = () => {
    const { name, email, password, confirmPassword } = signInInputs;
    const newErrorsSignIn = {};

    if (!name) {
      newErrorsSignIn.name = "Please enter your name!";
    }
    if (!email) {
      newErrorsSignIn.email = "Please enter your email!";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrorsSignIn.email = "Please enter a valid email address!";
    }
    if (!password) {
      newErrorsSignIn.password = "Please enter your password!";
    } else {
      const passwordStrength = getPasswordStrength(password);
      // newErrorsSignIn.passwordStrength = passwordStrength;
      if (passwordStrength !== "strong") {
        newErrorsSignIn.password = "Please enter a stronger password!";
      }
    }
    if (!confirmPassword) {
      newErrorsSignIn.confirmPassword = "Please confirm your password!";
    } else if (password !== confirmPassword) {
      newErrorsSignIn.confirmPassword = "Passwords do not match!";
    }

    setSignInErrors(newErrorsSignIn);
    return Object.keys(newErrorsSignIn).length === 0;
  };

  // const getPasswordStrengthColor = () => {
  //   const passwordStrength = getPasswordStrength(signInInputs.password);

  //   if (passwordStrength === "strong") {
  //     return "green";
  //   } else if (passwordStrength === "medium") {
  //     return "orange";
  //   } else {
  //     return "red";
  //   }
  // };

  const getPasswordStrength = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (password.length >= 8 && hasUppercase && hasLowercase && hasNumber) {
      return "strong";
    } else if (
      password.length >= 6 &&
      (hasUppercase || hasLowercase || hasNumber)
    ) {
      return "medium";
    } else {
      return "poor";
    }
  };

  const signInHandler = async(e) => {
    e.preventDefault();
    const validationErrors = validateFieldsSignIn();
    if (validationErrors) {
      let data = {
        name: signInInputs.name,
        email: signInInputs.email,
        password: signInInputs.password,
      };
      await axios.post(SIGNUP_API, data)
        .then((response) => {
          if (response.data.message === "Registered Successfully!!!") {
            alert(response.data.message);
            handleSignInClick();
          } else {
            alert(response.data.message);
          }
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    } else {
      // Check if the error messages are not empty
      const errorMessages = Object.values(signInErrors).join("\n");
      if (errorMessages.trim() !== "") {
        alert(errorMessages);
      } else {
        alert("Please fill in all the required fields.");
      }
    }
  };

  return (
    // Login
    <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form onSubmit={loginHandler} className="sign-in-form">
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="text"
                placeholder="Email"
                value={loginUser.email || ""}
                name="email"
                onChange={inputHandlerLogin}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={loginUser.password || ""}
                onChange={inputHandlerLogin}
                placeholder="Password"
              />
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={toggleShowPassword}
              />
              <label className="form-check-label" htmlFor="showPassword">
                &nbsp;Show Password
              </label>
            </div>
            <button type="submit" className="btn solid">
              LOGIN
            </button>
          </form>
          {/* SignUp */}
          <form onSubmit={signInHandler} className="sign-up-form">
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fas fa-loginUser"></i>
              <input
                type="text"
                name="name"
                className={`form-control ${
                  signInErrors.name ? "is-invalid" : ""
                }`}
                onChange={sinputHandlerSignIn}
                placeholder="Name"
              />
            </div>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="text"
                name="email"
                value={signInInputs.email || ""}
                className={`form-control ${
                  signInErrors.email ? "is-invalid" : ""
                }`}
                onChange={sinputHandlerSignIn}
                placeholder="Email"
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                className={`form-control ${
                  signInErrors.password ? "is-invalid" : ""
                }`}
                id="yourPassword"
                onChange={sinputHandlerSignIn}
              />
              {/* {signInInputs.password && (
                <div style={{ color: getPasswordStrengthColor() }}>
                  Password Strength:{" "}
                  {getPasswordStrength(signInInputs.password)}
                </div>
              )} */}
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                name="confirmPassword"
                className={`form-control ${
                  signInErrors.confirmPassword ? "is-invalid" : ""
                }`}
                id="confirmPassword"
                onChange={sinputHandlerSignIn}
              />
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="showConfirmPassword"
                checked={showPassword}
                onChange={toggleShowPassword}
              />
              <label className="form-check-label" htmlFor="showConfirmPassword">
                &nbsp;Show Password
              </label>
            </div>
            <button type="submit" className="btn solid">
              Sign up
            </button>
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here ?</h3>
            <p>Faculties who haven't created an account, please sign up</p>
            <button
              className="btn transparent"
              id="sign-up-btn"
              onClick={handleSignUpClick}
            >
              Sign up
            </button>
          </div>
          <img src={logSvg} className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us ?</h3>
            <p>Already have an account? Sign In</p>
            <button
              className="btn transparent"
              id="sign-in-btn"
              onClick={handleSignInClick}
            >
              Sign in
            </button>
          </div>
          <img src={registerSvg} className="image" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Login;
