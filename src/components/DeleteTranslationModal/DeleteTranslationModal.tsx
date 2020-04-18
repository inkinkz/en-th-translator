import React from "react";
import { database } from "../../shared/firebase";
import Modal from "react-bootstrap/Modal";

const TranslationItem = (props: any) => {
  const deleteTranslation = (): void => {
    database.ref("translations/" + props.unique_key).remove();
    alert("Removed successfully!");
    props.handleClose();
  };

  return (
    <Modal show={props.show} onHide={props.handleClose} centered={true}>
      <Modal.Header closeButton>
        <Modal.Title>Delete this tranlation?</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{props.english}</p>
        <p>{props.thai}</p>
        <p>Use Count: {props.useCount} </p>
      </Modal.Body>

      <Modal.Footer>
        <button
          className="modal-button-cancel"
          onClick={() => props.handleClose()}
        >
          CANCEL
        </button>
        <button className="modal-button-ok" onClick={() => deleteTranslation()}>
          CONFIRM
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default TranslationItem;
