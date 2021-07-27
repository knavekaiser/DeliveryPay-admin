import { useState, useEffect, useContext, useRef } from "react";
import { SiteContext } from "../SiteContext";
import { Route, Switch, useHistory, useLocation, Link } from "react-router-dom";
import { Checkbox } from "./Elements";
import { GoogleLogin } from "react-google-login";
require("./styles/userStart.scss");

const RegisterForm = () => {
  const { user, setUser } = useContext(SiteContext);
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91");
  const [pass, setPass] = useState("");
  const [confirm_pass, setConfirm_pass] = useState("");
  const [errMsg, setErrMsg] = useState(null);
  const submit = (e) => {
    e.preventDefault();
    if (pass !== confirm_pass) {
      setErrMsg("Password did not match.");
      return;
    }
    if (!phone.match(/^\+91\d{10}$/)) {
      setErrMsg("Enter valid phone number");
      return;
    }
    if (errMsg) return;
    fetch("/api/registerAdmin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email,
        password: pass,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(user);
          history.push("/dashboard/home");
        } else if (data.code === 11000) {
          setErrMsg("Email/Phone already exists.");
        }
      });
  };
  useEffect(() => {
    setErrMsg(null);
  }, [confirm_pass]);
  return (
    <div className="formWrapper">
      <img
        className="logo"
        onClick={() => history.push("")}
        src="/logo_land.jpg"
        alt="Delivery pay logo"
      />
      <p className="title">Register as Admin</p>
      <form onSubmit={submit}>
        <input
          type="text"
          name="firstName"
          required={true}
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          name="email"
          required={true}
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setErrMsg(null);
            setEmail(e.target.value);
          }}
        />
        <input
          type="tel"
          name="phone"
          required={true}
          placeholder="Phone number"
          value={phone}
          onChange={(e) => {
            setErrMsg(null);
            if (e.target.value.match(/^\+91\d{0,10}$/)) {
              setPhone(e.target.value);
            }
          }}
        />
        <section className="pass">
          <input
            type="password"
            name="password"
            required={true}
            placeholder="Password"
            aria-autocomplete="list"
            autoComplete="new-password"
            onChange={(e) => setPass(e.target.value)}
          />
        </section>
        <section className="repeatPass">
          <input
            type="password"
            name="confirm_password"
            id="confirm_password"
            required={true}
            placeholder="Confirm Password"
            aria-autocomplete="list"
            autoComplete="new-password"
            onChange={(e) => setConfirm_pass(e.target.value)}
          />
        </section>
        <section className="checkbox">
          <Checkbox required={true} />
          <label>I accept to the Terms and Conditions and Privacy Policy</label>
        </section>
        <button disabled={errMsg} type="submit">
          Register
        </button>
      </form>
      {errMsg && <p className="errMsg">{errMsg}</p>}
      <p className="links">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};
const LoginForm = () => {
  const { user, setUser } = useContext(SiteContext);
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [invalidCred, setInvadilCred] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (invalidCred) return;
    fetch("/api/adminLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password: pass,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(user);
          history.push("/dashboard/home");
        } else if (data.code === 401) {
          setInvadilCred("Invalid credential!");
        }
      });
  };
  const responseGoogle = (e) => {
    if (e.tokenId) {
      fetch("/api/adminLoginUsingSocial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleToken: e.tokenId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(user);
            history.push("/dashboard/home");
          } else if (data.code === 401) {
            setInvadilCred(
              "No account is associated with this Google account."
            );
            setTimeout(() => setInvadilCred(null), 2000);
          }
        });
    }
  };
  return (
    <div className="formWrapper login">
      <img
        className="logo"
        onClick={() => history.push("")}
        src="/logo_land.jpg"
        alt="Delivery pay logo"
      />
      <p className="title">Login as Admin</p>
      <form onSubmit={submit}>
        <input
          type="text"
          name="username"
          required={true}
          placeholder="Email  or Phone Number"
          value={username}
          onChange={(e) => {
            setInvadilCred(false);
            setUsername(e.target.value);
          }}
        />
        <section className="pass">
          <input
            type="password"
            name="password"
            required={true}
            placeholder="Password"
            value={pass}
            onChange={(e) => {
              setInvadilCred(false);
              setPass(e.target.value);
            }}
          />
          <Link className="passReset" to="/resetPassword">
            Forgot password?
          </Link>
        </section>
        <button disabled={invalidCred} type="submit">
          Login
        </button>
      </form>
      <section className="socials">
        <GoogleLogin
          className="google"
          clientId="978249749020-kjq65au1n373ur5oap7n4ebo2fq1jdhq.apps.googleusercontent.com"
          buttonText="Continue with Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={"single_host_origin"}
        />
      </section>
      <p className="links">
        Don't have an account? <Link to="/join">Register</Link>
      </p>
      {invalidCred && <p className="errMsg">{invalidCred}</p>}
    </div>
  );
};
const PasswordReset = () => {
  const { user, setUser } = useContext(SiteContext);
  const history = useHistory();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [invalidCred, setInvadilCred] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [pass, setPass] = useState("");
  const [confirm_pass, setConfirm_pass] = useState("");
  const [errMsg, setErrMsg] = useState(false);
  const code1 = useRef(null);
  const code2 = useRef(null);
  const code3 = useRef(null);
  const code4 = useRef(null);
  const code5 = useRef(null);
  const code6 = useRef(null);
  useEffect(() => {
    console.log(errMsg);
  }, [errMsg]);
  const submit = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (errMsg) return;
      fetch("/api/sendAdminForgotPassOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      }).then((res) => {
        if (res.status === 200) {
          setStep(2);
        } else {
          setErrMsg("User does does not exists.");
        }
      });
    } else if (step === 2) {
      fetch("/api/submitAdminForgotPassOTP", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: code.join("") }),
      }).then((res) => {
        if (res.status === 200) {
          setStep(3);
        } else if (res.status === 400) {
          setCode(["", "", "", "", "", ""]);
          setErrMsg("Wrong code!");
        } else if (res.status === 429) {
          setStep(1);
          setPhone("");
          setCode(["", "", "", "", "", ""]);
          setErrMsg("Too many tries. Start again.");
        } else if (res.status === 404) {
          setStep(1);
          setPhone("");
          setCode(["", "", "", "", "", ""]);
          setErrMsg("Timeout. Start again");
        }
      });
    } else if (step === 3) {
      if (pass !== confirm_pass) {
        setErrMsg("Password did not match");
        return;
      }
      fetch("/api/adminResetPass", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: code.join(""), newPass: pass }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(user);
            history.push("/dashboard/home");
          }
        });
    }
  };
  useEffect(() => {
    if (code.join("")) {
      setErrMsg(null);
    }
  }, [code]);
  return (
    <div className="formWrapper resetPass">
      <img className="logo" src="/logo_land.jpg" alt="Delivery pay logo" />
      <p className="title">Password reset</p>
      {step === 1 && (
        <form onSubmit={submit}>
          <input
            type="tel"
            name="phone"
            required={true}
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => {
              setErrMsg(null);
              setPhone(e.target.value);
            }}
          />
          <button disabled={errMsg} type="submit">
            Next
          </button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={submit}>
          <label>
            A 6 digit code has been sent to your phone. Enter the code below.
          </label>
          <section className="code">
            <input
              ref={code1}
              type="number"
              value={code[0]}
              required={true}
              onChange={(e) => {
                setCode((prev) => {
                  const newCode = [...prev];
                  newCode[0] = e.target.value[0] || "";
                  return newCode;
                });
                if (e.target.value.length === 1) {
                  code2.current.focus();
                }
              }}
            />
            <input
              ref={code2}
              type="number"
              value={code[1]}
              required={true}
              onChange={(e) => {
                setCode((prev) => {
                  const newCode = [...prev];
                  newCode[1] = e.target.value[0] || "";
                  return newCode;
                });
                if (e.target.value.length === 1) {
                  code3.current.focus();
                }
              }}
            />
            <input
              ref={code3}
              type="number"
              value={code[2]}
              required={true}
              onChange={(e) => {
                setCode((prev) => {
                  const newCode = [...prev];
                  newCode[2] = e.target.value[0] || "";
                  return newCode;
                });
                if (e.target.value.length === 1) {
                  code4.current.focus();
                }
              }}
            />
            <input
              ref={code4}
              type="number"
              value={code[3]}
              required={true}
              onChange={(e) => {
                setCode((prev) => {
                  const newCode = [...prev];
                  newCode[3] = e.target.value[0] || "";
                  return newCode;
                });
                if (e.target.value.length === 1) {
                  code5.current.focus();
                }
              }}
            />
            <input
              ref={code5}
              type="number"
              value={code[4]}
              required={true}
              onChange={(e) => {
                setCode((prev) => {
                  const newCode = [...prev];
                  newCode[4] = e.target.value[0] || "";
                  return newCode;
                });
                if (e.target.value.length === 1) {
                  code6.current.focus();
                }
              }}
            />
            <input
              ref={code6}
              type="number"
              value={code[5]}
              required={true}
              onChange={(e) => {
                setCode((prev) => {
                  const newCode = [...prev];
                  newCode[5] = e.target.value[0] || "";
                  return newCode;
                });
              }}
            />
          </section>
          <button disabled={errMsg} type="submit">
            Next
          </button>
        </form>
      )}
      {step === 3 && (
        <form onSubmit={submit}>
          <input
            type="password"
            name="password"
            required={true}
            placeholder="Password"
            aria-autocomplete="list"
            autoComplete="new-password"
            onChange={(e) => {
              setErrMsg(null);
              setPass(e.target.value);
            }}
          />
          <section className="pass">
            <input
              type="password"
              name="confirm_password"
              id="confirm_password"
              required={true}
              placeholder="Confirm Password"
              aria-autocomplete="list"
              autoComplete="new-password"
              onChange={(e) => {
                setErrMsg(null);
                setConfirm_pass(e.target.value);
              }}
            />
          </section>
          <button disabled={errMsg} type="submit">
            {step === 3 ? "Submit" : "Next"}
          </button>
        </form>
      )}
      {errMsg && <p className="errMsg">{errMsg}</p>}
      <p className="links">
        Already have an account?<Link to="/login">Login</Link>
      </p>
    </div>
  );
};

function UserStart() {
  const { setUser } = useContext(SiteContext);
  const history = useHistory();
  useEffect(() => {
    fetch("/api/authAdmin")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          history.push(history.location.state?.from || "/dashboard/home");
        }
      });
  }, []);
  return (
    <div className="userStart">
      <div className="banner">
        <header>
          <h3>This section is only for Admins</h3>
          <p>Make sure you know what you're doing.</p>
        </header>
        <img
          className="illustration"
          src="/landingPage_illustration.svg"
          alt="illustration"
        />
      </div>
      <div className="forms">
        <Switch>
          <Route path="/join">
            <RegisterForm />
          </Route>
          <Route path="/resetPassword">
            <PasswordReset />
          </Route>
          <Route path="/">
            <LoginForm />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default UserStart;
