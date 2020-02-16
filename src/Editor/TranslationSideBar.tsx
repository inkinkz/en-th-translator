import React, { useState } from "react";
import "./Edit.scss";
import { DocumentEditorContainerComponent } from "@syncfusion/ej2-react-documenteditor";
import { AddData } from "../App";
import { database } from "../firebase";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useSelector } from "react-redux";
import { PatentTranslator } from "../redux/types";
import TranslationSideBarItem from "./TranslationSideBarItem";

const TranslationSideBar = (props: {
  container: DocumentEditorContainerComponent;
  searchFor: (text: string) => void;
  replaceWithThai: (text: string) => void;
  triggerSearch: (move: boolean) => void;
}) => {
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [addData, setAddData] = useState<AddData>({ english: "", thai: "" });
  const [show, setShow] = useState(false);

  const foundTexts = useSelector((state: PatentTranslator) => state.foundTexts);

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
      <h2
        className="suggestion-header"
        onClick={() => props.triggerSearch(true)}
      >
        Translations
      </h2>

      <div className="suggestion-items-container">
        {foundTexts.map((keys: string, index: number) => {
          return (
            <TranslationSideBarItem
              key={index}
              current={keys}
              searchFor={props.searchFor}
              replaceWithThai={props.replaceWithThai}
            />
          );
        })}
      </div>

      <div className="suggestion-footer" onClick={handleShow}>
        + Add new translation
      </div>
    </div>
  );
};

export default TranslationSideBar;
