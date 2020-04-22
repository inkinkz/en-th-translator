import React, { useEffect, useState, useCallback } from "react";
import "./Manage.scss";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { withRouter } from "react-router-dom";
import { Tooltip } from "@syncfusion/ej2-popups";
import TranslationItem from "../../components/TranlationItem/TranslationItem";
import { database } from "../../shared/firebase";
import Form from "react-bootstrap/Form";

import { useSelector, useDispatch } from "react-redux";
import { PatentTranslator } from "../../shared/types";
import { SET_KEYS_TO_SHOW } from "../../shared/redux/actions";
import { useDebouncedCallback } from "use-debounce";
import Spinner from "react-bootstrap/Spinner";

import AddTranslationModal from "../../components/AddTranslationModal/AddTranslationModal";

// Render each translation
// const Row = ({ index, style }: any) => {
//   const keys = useSelector((state: PatentTranslator) => state.keysToShow);
//   return (
//     <div style={style}>
//       <TranslationItem unique_key={keys[index]}></TranslationItem>
//     </div>
//   );
// };

const Manage = (props: any) => {
  const [show, setShow] = useState(false);
  const [sortBy, setSortBy] = useState("alphabetically");
  const [searchEnglish, setSearchEnglish] = useState("");
  const [searchThai, setSearchThai] = useState("");
  const [search, triggerSearch] = useState<boolean>(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const dispatch = useDispatch();
  const uniqueKeys = useSelector((state: PatentTranslator) => state.uniqueKeys);
  const uniqueKeysSortByUseCount = useSelector(
    (state: PatentTranslator) => state.uniqueKeysSortByUseCount
  );
  const keysToShow = useSelector((state: PatentTranslator) => state.keysToShow);

  const setKeysToShow = useCallback(
    (keys: string[]) => dispatch({ type: SET_KEYS_TO_SHOW, payload: keys }),
    [dispatch]
  );

  const addToolTip: Tooltip = new Tooltip({
    content: "Add new translation.",
    position: "LeftCenter",
  });

  const Row = ({ index, style }: any) => {
    return (
      <div style={style}>
        <TranslationItem unique_key={keysToShow[index]}></TranslationItem>
      </div>
    );
  };

  // Delay before search
  const [debouncedCallback] = useDebouncedCallback(() => {
    triggerSearch(!search);
  }, 400);

  useEffect(() => {
    const keyToUse = sortBy === "used" ? uniqueKeysSortByUseCount : uniqueKeys;
    if (searchThai.trim() !== "" || searchEnglish.trim() !== "") {
      const ref = database.ref("translations");
      const temp: string[] = [];

      keyToUse.forEach(async (key) => {
        let checkEnglish = true;
        let checkThai = true;
        await ref.child(key).once("value", (snapshot) => {
          //Check Eng
          if (searchEnglish.trim() !== "") {
            if (
              !snapshot
                .child("english")
                .val()
                .toLowerCase()
                .includes(searchEnglish.toLowerCase().trim())
            )
              checkEnglish = false;
          }

          //Check Thai
          if (searchThai.trim() !== "") {
            if (
              !snapshot
                .child("thai")
                .val()
                .toLowerCase()
                .includes(searchThai.trim())
            )
              checkThai = false;
          }
          if (checkEnglish && checkThai) temp.push(key);
        });
      });

      setKeysToShow(temp);
    } else {
      setKeysToShow(keyToUse);
    }
    return () => {};
    // eslint-disable-next-line
  }, [sortBy, setKeysToShow, uniqueKeys, uniqueKeysSortByUseCount, search]);

  useEffect(() => {
    addToolTip.appendTo("#add");
  }, [addToolTip]);

  const sortChange = () => {
    setSortBy(
      (document.getElementById("sort_selector")! as HTMLSelectElement).value
    );
  };

  return (
    <div id="manage-translations">
      <AddTranslationModal show={show} handleClose={handleClose} />
      <header id="manage-header">
        <div className="manage-title">
          <h1>Manage Translations</h1>
        </div>
        <div className="manage-navigations">
          <ul>
            <li>
              <Form.Control
                as="select"
                id="sort_selector"
                onChange={(e) => {
                  sortChange();
                }}
              >
                <option value="alphabetically">Sort Alphabetically</option>
                <option value="used">Sort by most used</option>
              </Form.Control>
            </li>
            <li>
              <div
                className="redirect-button"
                onClick={() => {
                  props.history.push("/");
                }}
              >
                Home
              </div>
            </li>
            <li>
              <div
                className="redirect-button"
                onClick={() => {
                  props.history.push("/edit");
                }}
              >
                Editor
              </div>
            </li>
          </ul>
        </div>
      </header>
      <div id="manage-translations-body">
        <div className="translation-container">
          <div className="translation-headers-container">
            <div className="translation-header">
              <h4>English</h4>
              <Form.Control
                name="searchEnglish"
                type="text"
                placeholder="Search English..."
                value={searchEnglish}
                style={{ width: "50%", marginLeft: "0" }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchEnglish(e.target.value);
                  debouncedCallback();
                }}
              />
            </div>
            <div className="translation-header">
              <h4>Thai</h4>
              <Form.Control
                name="searchThai"
                type="text"
                placeholder="Search Thai..."
                value={searchThai}
                style={{ width: "60%" }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchThai(e.target.value);
                  debouncedCallback();
                }}
              />
              <div
                id="add"
                className="e-icons e-add"
                onClick={handleShow}
              ></div>
            </div>
          </div>
          <div className="translation-items-container">
            {keysToShow.length > 0 ? (
              <div className="auto-sizer">
                <AutoSizer>
                  {({ height, width }) => (
                    <List
                      style={{ overflowX: "hidden" }}
                      height={height - 60}
                      itemCount={keysToShow.length}
                      itemSize={60}
                      width={width}
                    >
                      {Row}
                    </List>
                  )}
                </AutoSizer>
              </div>
            ) : (
              <Spinner animation="border" variant="warning" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Manage);
