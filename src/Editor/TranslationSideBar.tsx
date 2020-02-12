import React, { useState } from "react";
import "./Edit.scss";
import { DocumentEditorContainerComponent } from "@syncfusion/ej2-react-documenteditor";
import { AddData } from "../App";
import { database } from "../firebase";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const TranslationSideBar = (props: {
  container: DocumentEditorContainerComponent;
  searchFor: (text: string) => void;
  replaceWithThai: (text: string) => void;
}) => {
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [addData, setAddData] = useState<AddData>({ english: "", thai: "" });
  const [show, setShow] = useState(false);

  const handleAddInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAddData({ ...addData, [e.target.name]: e.target.value });
  };

  const addNewTranslation = async (): Promise<void> => {
    const ref = database.ref("translations");

    await ref.push({
      english: addData.english,
      thai: addData.thai
    });
    alert("Translation added successfully.");
    handleClose();
    setAddData({ english: "", thai: "" });
  };

  return (
    <div className="suggestion-panel">
      <Modal show={show} onHide={handleClose} centered={true}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Translation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="addEnglish">
              <Form.Label>English</Form.Label>
              <Form.Control
                name="english"
                type="text"
                placeholder="English translation here"
                value={addData.english}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleAddInput(e);
                }}
              />
            </Form.Group>
            <Form.Group controlId="addThai">
              <Form.Label>Thai</Form.Label>
              <Form.Control
                name="thai"
                type="text"
                placeholder="คำแปลภาษาไทย"
                value={addData.thai}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleAddInput(e);
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
      <h2 className="suggestion-header">Translations</h2>
      <div className="suggestion-items-container">
        {/* Test Items */}
        <div
          className="suggestion-item"
          onClick={() => {
            props.searchFor("insert");
          }}
        >
          <span style={{ fontWeight: "bold" }}>Insert</span>
          &nbsp; =&gt; ใส่
          <div
            className="replace-button"
            onClick={() => {
              props.replaceWithThai("ใส่");
            }}
          >
            Replace
          </div>
        </div>

        <div className="suggestion-item-separator"></div>

        <div className="suggestion-item">
          <span style={{ fontWeight: "bold" }}>This is an English text</span>
          &nbsp; =&gt; คำแปลภาษาไทย
          <div className="replace-button">Replace</div>
        </div>
        <div className="suggestion-item-separator"></div>

        <div className="suggestion-item">
          <span style={{ fontWeight: "bold" }}>This is an English text</span>
          &nbsp; =&gt; คำแปลภาษาไทย
          <div className="replace-button">Replace</div>
        </div>
        <div className="suggestion-item-separator"></div>
        <div className="suggestion-item">
          <span style={{ fontWeight: "bold" }}>This is an English text</span>
          &nbsp; =&gt; คำแปลภาษาไทย
          <div className="replace-button">Replace</div>
        </div>
        <div className="suggestion-item-separator"></div>
      </div>
      <div className="suggestion-footer" onClick={handleShow}>
        + Add new translation
      </div>
    </div>
  );
};

export default TranslationSideBar;
