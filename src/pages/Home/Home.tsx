import React from "react";
import "./Home.scss";
import { RouteComponentProps } from "react-router";
import logo from "../../shared/images/translate.svg";
import { withRouter } from "react-router-dom";

// import { PatentTranslator } from "../redux/types";
// import { useSelector } from "react-redux";
// import { database } from "../firebase";

const Home = (props: RouteComponentProps) => {
  // const uniqueKeys = useSelector((state: PatentTranslator) => state.uniqueKeys);

  // // For one time Firebase query
  // const doThis = () => {
  //   const ref = database.ref("translations");

  //   uniqueKeys.forEach(key => {
  //     ref.child(key).update({ use_count: 0 });
  //   });
  // };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Patent Translator</p>
        {/* <button onClick={() => doThis()}>QUERY</button> */}
        <div
          className="App-link"
          style={{ cursor: "pointer" }}
          onClick={() => props.history.push("/edit")}
        >
          Go to editor..
        </div>
        <div
          className="App-link"
          style={{ cursor: "pointer" }}
          onClick={() => props.history.push("/manage")}
        >
          Manage Translations
        </div>
      </header>
    </div>
  );
};

export default withRouter(Home);
