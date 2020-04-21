import React, { useState, useRef, useEffect } from "react";
import "./AddTranslationModal.scss";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { AddData } from "../../shared/types";
import { database } from "../../shared/firebase";

const AddTranslationModal = (props: any) => {
  const [addData, setAddData] = useState<AddData>({ english: "", thai: "" });

  const engRef = useRef<HTMLInputElement & FormControl>(null);
  const thaiRef = useRef<HTMLInputElement & FormControl>(null);

  const handleAddInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAddData({ ...addData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (props.show) {
      setTimeout(() => {
        if (engRef.current) engRef.current.focus();
      }, 100);
    }
  }, [props.show]);

  const addNewTranslation = async (): Promise<void> => {
    const ref = database.ref("translations");
    let add = true;
    ref.on(
      "value",
      (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const snap = childSnapshot.val();
          if (snap) {
            if (
              snap.thai === addData.thai.trim() &&
              snap.english === addData.english.trim()
            )
              add = false;
          }
        });
      },
      (err: Error) => {
        console.log(err);
      }
    );

    props.handleClose();
    if (add) {
      await ref.push({
        english: addData.english.trim(),
        thai: addData.thai.trim(),
        use_count: 0,
      });
      alert("Translation added successfully.");
    } else {
      alert("Translation Pair Already Exist!");
    }
    setAddData({ english: "", thai: "" });
  };

  return (
    <Modal
      enforceFocus={false}
      show={props.show}
      onHide={props.handleClose}
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
        <button
          className="modal-button-cancel"
          onClick={() => props.handleClose()}
        >
          CANCEL
        </button>
        <button className="modal-button-ok" onClick={() => addNewTranslation()}>
          ADD
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddTranslationModal;
