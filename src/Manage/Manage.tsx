import React, { useEffect, useState, useRef } from "react";
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
import { useSelector } from "react-redux";
import { PatentTranslator } from "../redux/types";

// or Render each translation here

// Render each translation
const Row = ({ index, style }: any) => {
  const uniqueKeys = useSelector((state: PatentTranslator) => state.uniqueKeys);
  return (
    <div style={style}>
      <TranslationItem unique_key={uniqueKeys[index]}></TranslationItem>
    </div>
  );
};

const Manage = (props: any) => {
  const [addData, setAddData] = useState<AddData>({ english: "", thai: "" });
  const [show, setShow] = useState(false);

  const engRef = useRef<HTMLInputElement & FormControl>(null);
  const thaiRef = useRef<HTMLInputElement & FormControl>(null);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    setTimeout(() => {
      if (engRef.current) engRef.current.focus();
    }, 100);
  };

  // const dispatch = useDispatch();
  const uniqueKeys = useSelector((state: PatentTranslator) => state.uniqueKeys);

  const addToolTip: Tooltip = new Tooltip({
    content: "Add new translation.",
    position: "LeftCenter"
  });

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
            </div>
            <div className="translation-header">
              <h4>Thai</h4>
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
                    height={height - 50}
                    itemCount={uniqueKeys.length}
                    itemSize={60}
                    width={width}
                    // itemData={[
                    //   displayKey,
                    //   selectedRow,
                    //   setEditingUniqueKey,
                    //   permissions
                    // ]}
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
