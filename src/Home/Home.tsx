import React from "react";
import "../App.scss";
import "./Home.scss";
import { RouteComponentProps } from "react-router";
import logo from "./translate.svg";
// const logo = require("../logo.svg") as string;

const Home = (props: RouteComponentProps) => {
  return (
    <div className="App">
      <header className="App-header">
        <img
          src={logo}
          className="App-logo"
          alt="logo"
          style={{ marginBottom: "1rem" }}
        />
        <p>Patent Translator</p>
        <div
          className="App-link"
          style={{ cursor: "pointer" }}
          onClick={() => props.history.push("/edit")}
        >
          Go to editor..
        </div>
      </header>
    </div>
  );
};

export default Home;
