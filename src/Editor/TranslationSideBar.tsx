import React, {
  useState,
  useRef,
  forwardRef
  // useImperativeHandle
} from "react";
import "./Edit.scss";
import { DocumentEditorContainerComponent } from "@syncfusion/ej2-react-documenteditor";
import { AddData } from "../App";
import { database } from "../firebase";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { useSelector } from "react-redux";
import { PatentTranslator } from "../redux/types";
import TranslationSideBarItem from "./TranslationSideBarItem";

const TranslationSideBar = forwardRef(
  (
    props: {
      container: DocumentEditorContainerComponent;
      currentWord: string;
      searchFor: (text: string) => void;
      replaceWithThai: (text: string) => void;
      replaceAll: (text: string) => void;
      triggerSearch: (move: boolean) => void;
    },
    ref
  ) => {
    const [addData, setAddData] = useState<AddData>({ english: "", thai: "" });
    const [show, setShow] = useState(false);

    const foundTexts = useSelector(
      (state: PatentTranslator) => state.foundTexts
    );
    const engRef = useRef<HTMLInputElement & FormControl>(null);
    const thaiRef = useRef<HTMLInputElement & FormControl>(null);

    const handleClose = () => setShow(false);
    const handleShow = () => {
      setShow(true);
      setTimeout(() => {
        setAddData({ english: props.currentWord, thai: "" });
        if (engRef.current) engRef.current.focus();
      }, 100);
    };

    const handleAddInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
      setAddData({ ...addData, [e.target.name]: e.target.value });
    };

    const addNewTranslation = async (): Promise<void> => {
      const ref = database.ref("translations");
      let add = true;
      ref.on(
        "value",
        snapshot => {
          snapshot.forEach(childSnapshot => {
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

      handleClose();
      if (add) {
        await ref.push({
          english: addData.english.trim(),
          thai: addData.thai.trim(),
          use_count: 0
        });
        alert("Translation added successfully.");
      } else {
        alert("Translation Pair Already Exist!");
      }
      setAddData({ english: "", thai: "" });
    };

    // useImperativeHandle(ref, () => ({
    //   getAlert() {
    //     alert("getAlert from Child");
    //   }
    // }));

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
              onClick={() => handleClose()}
            >
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
                replaceAll={props.replaceAll}
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
  }
);

export default TranslationSideBar;
