import React from "react";
import "./App.scss";
import { HashRouter, Route } from "react-router-dom";
import Home from "./Home/Home";
import Edit from "./Editor/Edit";
import Manage from "./Manage/Manage";

const App = () => {
  return (
    <React.Fragment>
      <HashRouter>
        <React.Fragment>
          <Route path="/edit" component={Edit} />
          <Route path="/manage" component={Manage} />
          <Route path="/" component={Home} />
        </React.Fragment>
      </HashRouter>
    </React.Fragment>
  );
};

export default App;
