import React, { useEffect, useState } from "react";
import "./TranslationItem.scss";
import { Tooltip } from "@syncfusion/ej2-popups";
import { database } from "../../shared/firebase";
import DeleteTranslationModal from "../DeleteTranslationModal/DeleteTranslationModal";

const TranslationItem = (props: { unique_key: string }) => {
  const delToolTip: Tooltip = new Tooltip({
    content: "Delete this translation.",
    position: "LeftCenter",
  });

  const [english, setEnglish] = useState<string>("");
  const [thai, setThai] = useState<string>("");
  const [useCount, setUseCount] = useState<number>(0);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    delToolTip.appendTo("#delete");
  }, [delToolTip]);

  useEffect(() => {
    const query = database.ref("translations").child(props.unique_key);
    const onValue = (snapshot: firebase.database.DataSnapshot) => {
      const snap = snapshot.val();
      if (snap) {
        setThai(snap.thai);
        setEnglish(snap.english);
        setUseCount(snap.use_count);
      }
    };
    query.on("value", onValue);
  }, [props.unique_key]);

  const translationChange = async (language: string): Promise<void> => {
    let duplicate = false;

    // Reference the key
    const keyRef = database.ref("translations/" + props.unique_key);

    await keyRef.child(language).once("value", (snapshot) => {
      const data = snapshot.val();
      if (language === "english") {
        if (data.trim() === english.trim()) duplicate = true;
      } else if (language === "thai") {
        if (data.trim() === thai.trim()) duplicate = true;
      }
    });

    if (!duplicate) {
      if (language === "english") {
        keyRef.update({
          [language]: english,
        });
      } else {
        keyRef.update({
          [language]: thai,
        });
      }
      (document.activeElement as HTMLElement).blur();
      alert("Translation Updated!");
    }
  };

  // When user pressed "ESC", revert translation back to what saved in the database.
  const revertTranslation = (language: string): void => {
    const ref = database.ref("translations");
    ref.child(props.unique_key).on("value", (snapshot) => {
      if (language === "thai") {
        setThai(snapshot.child("thai").val());
      } else if (language === "english") {
        setEnglish(snapshot.child("english").val());
      }
      (document.activeElement as HTMLElement).blur();
    });
    return;
  };

  return (
    <div className="translation-item">
      <DeleteTranslationModal
        unique_key={props.unique_key}
        handleClose={handleClose}
        show={show}
        thai={thai}
        english={english}
        useCount={useCount}
      />
      <div className="translation">
        <div className="translation-input">
          <input
            type="text"
            value={english}
            onChange={(e) => {
              setEnglish(e.target.value);
            }}
            onKeyDown={(event) => {
              if (
                event.key === "Escape" ||
                event.key === "Esc" ||
                event.keyCode === 27
              ) {
                revertTranslation("english");
              } else if (event.key === "Enter" || event.keyCode === 13) {
                translationChange("english");
              }
            }}
          />
        </div>
      </div>
      <div className="translation">
        <div className="translation-input">
          <input
            type="text"
            value={thai}
            onChange={(e) => {
              setThai(e.target.value);
            }}
            onKeyDown={(event) => {
              if (
                event.key === "Escape" ||
                event.key === "Esc" ||
                event.keyCode === 27
              ) {
                revertTranslation("thai");
              } else if (event.key === "Enter" || event.keyCode === 13) {
                translationChange("thai");
              }
            }}
          />
        </div>
        <div
          id="delete"
          className="e-icons e-delete"
          onClick={handleShow}
        ></div>
      </div>
    </div>
  );
};

export default TranslationItem;
