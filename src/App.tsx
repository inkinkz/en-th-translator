import React, { useEffect, useCallback } from "react";
import "./App.scss";
import { HashRouter, Route } from "react-router-dom";
import Home from "./Home/Home";
import Edit from "./Editor/EditHook";
import Manage from "./Manage/Manage";
import { database } from "./firebase";
import { useDispatch } from "react-redux";
import { SET_ENGLISH_TEXTS, SET_UNIQUE_KEYS } from "./redux/actions";

export interface AddData {
  english: string;
  thai: string;
}

const App = () => {
  const dispatch = useDispatch();
  const setUniqueKeys = useCallback(
    (keys: string[]) => dispatch({ type: SET_UNIQUE_KEYS, payload: keys }),
    [dispatch]
  );
  const setEnglishTexts = useCallback(
    (keys: string[]) => dispatch({ type: SET_ENGLISH_TEXTS, payload: keys }),
    [dispatch]
  );

  useEffect(() => {
    const ref = database.ref("translations");
    ref
      .orderByChild("english") // Keys sort alphabetically
      .on(
        "value",
        snapshot => {
          const keys: string[] = [];
          const texts: string[] = [];
          snapshot.forEach(childSnapshot => {
            keys.push(childSnapshot.key!);
            texts.push(childSnapshot.child("english").val());
          });
          setUniqueKeys(keys);
          setEnglishTexts(texts);
        },
        (err: Error) => {
          console.log(err);
        }
      );
  }, [setEnglishTexts, setUniqueKeys]);

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
