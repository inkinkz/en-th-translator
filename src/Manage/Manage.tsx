import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Manage.scss";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { withRouter } from "react-router-dom";
import { Tooltip } from "@syncfusion/ej2-popups";
import TranslationItem from "./TranslationItem";
import { database } from "../firebase";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { AddData } from "../App";
import { useSelector, useDispatch } from "react-redux";
import { PatentTranslator } from "../redux/types";
import { SET_KEYS_TO_SHOW } from "../redux/actions";
import { useDebouncedCallback } from "use-debounce";

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
  const [addData, setAddData] = useState<AddData>({ english: "", thai: "" });
  const [show, setShow] = useState(false);
  const [sortBy, setSortBy] = useState("alphabetically");
  const [searchEnglish, setSearchEnglish] = useState("");
  const [searchThai, setSearchThai] = useState("");
  const [search, triggerSearch] = useState<boolean>(false);

  const engRef = useRef<HTMLInputElement & FormControl>(null);
  const thaiRef = useRef<HTMLInputElement & FormControl>(null);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    setTimeout(() => {
      if (engRef.current) engRef.current.focus();
    }, 100);
  };

  const dispatch = useDispatch();
  const uniqueKeys = useSelector((state: PatentTranslator) => state.uniqueKeys);
  const uniqueKeysSortByUseCount = useSelector(
    (state: PatentTranslator) => state.uniqueKeysSortByUseCount
  );

  const setKeysToShow = useCallback(
    (keys: string[]) => dispatch({ type: SET_KEYS_TO_SHOW, payload: keys }),
    [dispatch]
  );

  const addToolTip: Tooltip = new Tooltip({
    content: "Add new translation.",
    position: "LeftCenter"
  });

  const keysToShow = useSelector((state: PatentTranslator) => state.keysToShow);

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

      keyToUse.forEach(async key => {
        let checkEnglish = true;
        let checkThai = true;
        await ref.child(key).once("value", snapshot => {
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

    // eslint-disable-next-line
  }, [sortBy, setKeysToShow, uniqueKeys, uniqueKeysSortByUseCount, search]);

  useEffect(() => {
    addToolTip.appendTo("#add");
  }, [addToolTip]);

  const handleAddInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAddData({ ...addData, [e.target.name]: e.target.value });
  };

  const addNewTranslation = async (): Promise<void> => {
    const ref = database.ref("translations");
    handleClose();
    await ref.push({
      english: addData.english,
      thai: addData.thai,
      use_count: 0
    });
    setAddData({ english: "", thai: "" });
    alert("Translation added successfully.");
  };

  const sortChange = () => {
    setSortBy(
      (document.getElementById("sort_selector")! as HTMLSelectElement).value
    );
  };

  return (
    <div id="manage-translations">
      <Modal
        enforceFocus={false}
        show={show}
        onHide={handleClose}
        centered={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Translation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="addEnglish">
              <Form.Label>English</Form.Label>
              <Form.Control
                ref={engRef as React.RefObject<any>}
                name="english"
                type="text"
                placeholder="English translation here"
                value={addData.english}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleAddInput(e);
                }}
                onKeyDown={(e: { key: string; keyCode: number }) => {
                  if (e.key === "Enter" || e.keyCode === 13) {
                    if (addData.english !== "" || addData.thai !== "")
                      addNewTranslation();
                  }
                  if (e.keyCode === 40) {
                    if (thaiRef.current) thaiRef.current.focus();
                  }
                }}
              />
            </Form.Group>
            <Form.Group controlId="addThai">
              <Form.Label>Thai</Form.Label>
              <Form.Control
                ref={thaiRef as React.RefObject<any>}
                name="thai"
                type="text"
                placeholder="คำแปลภาษาไทย"
                value={addData.thai}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleAddInput(e);
                }}
                onKeyDown={(e: { key: string; keyCode: number }) => {
                  if (e.key === "Enter" || e.keyCode === 13) {
                    if (addData.english !== "" || addData.thai !== "")
                      addNewTranslation();
                  }
                  if (e.keyCode === 38) {
                    if (engRef.current) engRef.current.focus();
                  }
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button className="modal-button-cancel" onClick={() => handleClose()}>
            CANCEL
          </button>
          <button
            className="modal-button-ok"
            onClick={() => addNewTranslation()}
          >
            ADD
          </button>
        </Modal.Footer>
      </Modal>
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
                onChange={e => {
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Manage);
