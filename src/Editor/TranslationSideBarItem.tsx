import React, { useState, useEffect } from "react";
import "./Edit.scss";
import { database } from "../firebase";

const TranslationSideBar = (props: {
  current: string;
  searchFor: (text: string) => void;
  replaceWithThai: (text: string) => void;
}) => {
  const [english, setEnglish] = useState("");
  const [thai, setThai] = useState("");

  useEffect(() => {
    database
      .ref("translations")
      .child(props.current)
      .once("value", snapshot => {
        const item = snapshot.val();
        setEnglish(item.english);
        setThai(item.thai);
      });
  }, [props]);

  const replaceText = () => {
    const ref = database.ref("translations").child(props.current);
    let count: number;

    ref
      .once("value", snapshot => {
        const data = snapshot.val();
        count = data.use_count + 1;
      })
      .then(() => {
        ref.update({ use_count: count });
      });

    props.replaceWithThai(thai);
  };

  return (
    <React.Fragment>
      <div
        className="suggestion-item"
        onClick={() => {
          props.searchFor(english);
        }}
      >
        <span style={{ fontWeight: "bold" }}>{english}</span>
        &nbsp; =&gt; {thai}
        <div
          className="replace-button"
          onClick={() => {
            replaceText();
          }}
        >
          Replace
        </div>
      </div>
      <div className="suggestion-item-separator"></div>
    </React.Fragment>
  );
};

export default TranslationSideBar;
