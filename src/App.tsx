import React, { useEffect, useCallback } from "react";
import "./App.scss";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import Home from "./pages/Home/Home";
import Edit from "./pages/Editor/EditHook";
import Manage from "./pages/Manage/Manage";
import { database } from "./shared/firebase";
import { useDispatch } from "react-redux";
import {
  SET_ENGLISH_TEXTS,
  SET_UNIQUE_KEYS,
  SET_KEYS_TO_SHOW,
  SET_UNIQUE_KEYS_SORT_BY_USE_COUNT,
} from "./shared/redux/actions";

const App = () => {
  const dispatch = useDispatch();
  const setUniqueKeys = useCallback(
    (keys: string[]) => dispatch({ type: SET_UNIQUE_KEYS, payload: keys }),
    [dispatch]
  );
  const setUniqueKeysSortByUseCount = useCallback(
    (keys: string[]) =>
      dispatch({ type: SET_UNIQUE_KEYS_SORT_BY_USE_COUNT, payload: keys }),
    [dispatch]
  );
  const setEnglishTexts = useCallback(
    (keys: string[]) => dispatch({ type: SET_ENGLISH_TEXTS, payload: keys }),
    [dispatch]
  );

  const setKeysToShow = useCallback(
    (keys: string[]) => dispatch({ type: SET_KEYS_TO_SHOW, payload: keys }),
    [dispatch]
  );

  useEffect(() => {
    const ref = database.ref("translations");
    ref
      .orderByChild("english") // Keys sort alphabetically
      .on(
        "value",
        (snapshot) => {
          const keys: string[] = [];
          snapshot.forEach((childSnapshot) => {
            keys.push(childSnapshot.key!);
          });
          setUniqueKeys(keys);
          setKeysToShow(keys);
        },
        (err: Error) => {
          console.log(err);
        }
      );

    ref
      .orderByChild("use_count") // Keys sort by use count
      .on(
        "value",
        (snapshot) => {
          const keys: string[] = [];
          const texts: string[] = [];

          snapshot.forEach((childSnapshot) => {
            keys.push(childSnapshot.key!);
            texts.push(childSnapshot.child("english").val());
          });
          setUniqueKeysSortByUseCount(keys.reverse());
          setEnglishTexts(texts.reverse());
        },
        (err: Error) => {
          console.log(err);
        }
      );
  }, [
    setEnglishTexts,
    setUniqueKeys,
    setUniqueKeysSortByUseCount,
    setKeysToShow,
  ]);

  return (
    <HashRouter>
      <Switch>
        <Route path="/edit" component={Edit} />
        <Route path="/manage" component={Manage} />
        <Route path="/" component={Home} />
        <Redirect to="/" />
      </Switch>
    </HashRouter>
  );
};

export default App;
