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
import AllGroups from "./components/AllGroups";
import SingleGroup from "./components/SingleGroup";
import CreateGroup from "./components/CreateGroup";
import DGPage from "./components/DeleteGroupPage";
import AllEvents from "./components/AllEvents";
import SingleEvent from "./components/SingleEvent";
import CreateEvent from "./components/CreateEvent";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Switch>
        <Route path="/groups/:groupId/events/new" exact>
          <Navigation isLoaded={isLoaded} />
          <CreateEvent />
        </Route>
        <Route path="/creategroup" exact>
          <Navigation isLoaded={isLoaded} />
          <CreateGroup />
        </Route>
        <Route path="/deletedgroup" exact>
          <Navigation isLoaded={isLoaded} />
          <DGPage />
        </Route>
        <Route path="/groups/:groupId" exact>
          <Navigation isLoaded={isLoaded} />
          <SingleGroup />
        </Route>
        <Route path="/events/:eventId" exact>
          <Navigation isLoaded={isLoaded} />
          <SingleEvent />
        </Route>
        <Route path="/events" exact>
          <Navigation isLoaded={isLoaded} />
          <AllEvents />
        </Route>
        <Route path="/groups" exact>
          <Navigation isLoaded={isLoaded} />
          <AllGroups />
        </Route>
        <Route path="/" exact>
          <Navigation isLoaded={isLoaded} />
          <Greeting />
          <HMW />
          <ThreeFunctions />
          <JM />
        </Route>
        <Route>
          <Navigation isLoaded={isLoaded} />
          <ErrorPage />
        </Route>
      </Switch>
    </>
  );
}

export default App;