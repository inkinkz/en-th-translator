import React, { useState, useEffect } from "react";
import "./TranslationSideBar.scss";
import { database } from "../../shared/firebase";

const TranslationSideBar = (props: {
  current: string;
  count: number;
  searchFor: (text: string) => void;
  replaceWithThai: (text: string) => void;
  replaceAll: (text: string) => void;
}) => {
  const [english, setEnglish] = useState("");
  const [thai, setThai] = useState("");

  const displayCount = props.count > 0 ? {} : { display: "none" };

  useEffect(() => {
    database
      .ref("translations")
      .child(props.current)
      .once("value", (snapshot) => {
        const item = snapshot.val();
        if (item) {
          setEnglish(item.english);
          setThai(item.thai);
        }
      });
  }, [props]);

  const replaceText = (type: string) => {
    const ref = database.ref("translations").child(props.current);
    let count: number;

    ref
      .once("value", (snapshot) => {
        const data = snapshot.val();
        count = data.use_count + 1;
      })
      .then(() => {
        ref.update({ use_count: count });
      });

    if (type === "single") props.replaceWithThai(thai);
    else if (type === "all") props.replaceAll(thai);
  };

  return (
    <React.Fragment>
      <div
        className="suggestion-item"
        onClick={() => {
          props.searchFor(english);
        }}
      >
        <div className="translation-pair-text">
          <span style={{ fontWeight: "bold" }}>{english}</span>
          &nbsp; &hArr; &nbsp;
          {thai}
        </div>
        <div className="replace-button-container">
          <div
            className="replace-button"
            onClick={() => {
              replaceText("single");
            }}
          >
            Replace
          </div>
          <div
            className="replace-button replace-all-button"
            onClick={() => {
              replaceText("all");
            }}
          >
            Replace All
          </div>
          <div className="count" style={displayCount}>
            <span style={{ fontWeight: "bold" }}>{props.count}</span>
            &nbsp; time(s)
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TranslationSideBar;
