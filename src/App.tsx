import React from "react";
import "./App.css";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home/Home";
import Edit from "./Edit";

function App() {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <Route exact path="/edit" component={Edit} />
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
