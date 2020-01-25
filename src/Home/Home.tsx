import React from "react";
import "../App.scss";
import "./Home.scss";
import ImportModal from "./ImportModal";
import { RouteComponentProps } from "react-router";
// import FileViewer from "react-file-viewer";
const logo = require("../logo.svg") as string;

const Home = (props: RouteComponentProps) => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Best Editor</p>
        <ImportModal />
        <div
          className="App-link"
          style={{ cursor: "pointer" }}
          onClick={() => props.history.push("/edit")}
        >
          Open new file..
        </div>
        {/* <button type="button" className="btn color-primary">
          Open new file
        </button> */}
      </header>
    </div>
  );
};

export default Home;
