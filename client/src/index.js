import React, { useContext } from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider, SiteContext } from "./SiteContext";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, reported: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    const options = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        err: error.name,
        message: error.message,
        dscr: errorInfo,
      }),
    };
    fetch("/api/bugReportAuto", options)
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          this.reported = true;
        }
      });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="deathPage">
          <div className="content">
            <ion-icon name="skull-outline"></ion-icon>
            <h2>Oops.</h2>
            <a href="/">
              <ion-icon name="refresh-outline"></ion-icon>
            </a>
            {this.reported && <p>successfully reported</p>}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider>
        <App />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
