import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Greeting from "./components/Greeting";
import HMW from "./components/HMW";
import ThreeFunctions from "./components/ThreeButtons";
import JM from "./components/JM";
import ErrorPage from "./components/ErrorPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Switch>
        <Route path="/" exact>
          <Navigation isLoaded={isLoaded} />
          <Greeting />
          <HMW />
          <ThreeFunctions />
          <JM />
        </Route>
        <Route>
          <Navigation isLoaded={isLoaded}/>
          <ErrorPage />
        </Route>
      </Switch>
    </>
  );
}

export default App;