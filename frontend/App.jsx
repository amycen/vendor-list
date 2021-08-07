import React from "react";
import { Route, Switch } from "react-router-dom";
import { Home, Vendors } from "./pages";

function App() {
  return (
    <Switch>
      <Route
        exact
        path="/"
        name="Home"
        render={(props) => <Home {...props} />}
      />
      <Route
        path="/vendors"
        name="Vendors"
        render={(props) => <Vendors {...props} />}
      />
    </Switch>
  );
}

export default App;
