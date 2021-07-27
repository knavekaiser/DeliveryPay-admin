import { useContext, useState, useEffect } from "react";
import { SiteContext } from "./SiteContext";
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter,
  Link,
  useHistory,
} from "react-router-dom";
import { Modal } from "./components/Modal";
import UserStart from "./components/UserStart";
import Dashboard from "./components/Dashboard";

function resizeWindow() {
  let vh = window.innerHeight * 0.01;
  document.body.style.setProperty("--vh", `${vh}px`);
}

function ProtectedRoute({ children, path, component }) {
  const { user } = useContext(SiteContext);
  const history = useHistory();
  if (!user) {
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: { from: history.location.pathname },
        }}
      />
    );
  }
  return (
    <>
      <Route path={path} component={component}>
        {children}
      </Route>
    </>
  );
}

function App() {
  const [mobile, setMobile] = useState(window.innerWidth <= 480);
  useEffect(() => {
    window.addEventListener("resize", () => resizeWindow());
    resizeWindow();
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <Route path="/" component={UserStart} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
