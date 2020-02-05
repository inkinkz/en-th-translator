import React, { useEffect, useState } from "react";
import "./Manage.scss";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { withRouter } from "react-router-dom";
import { Tooltip } from "@syncfusion/ej2-popups";
import TranslationItem from "./TranslationItem";
import { database } from "../firebase";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

// or Render each translation here

const Manage = (props: any) => {
  const [uniqueKeys, setUniqueKeys] = useState<string[]>([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Render each translation
  const Row = ({ index, style }: any) => {
    return (
      <div style={style}>
        <TranslationItem unique_key={uniqueKeys[index]}></TranslationItem>
      </div>
    );
  };

  const addToolTip: Tooltip = new Tooltip({
    content: "Add new translation.",
    position: "LeftCenter"
  });

  useEffect(() => {
    addToolTip.appendTo("#add");
  }, [addToolTip]);

  useEffect(() => {
    const ref = database.ref("translations");
    ref // Keys sort alphabetically
      .once(
        "value",
        snapshot => {
          const temp: string[] = [];
          snapshot.forEach(childSnapshot => {
            temp.push(childSnapshot.key!);
          });
          setUniqueKeys(temp);
        },
        (err: Error) => {
          console.log(err);
        }
      );
  }, []);

  return (
    <div id="manage-translations">
      <Modal show={show} onHide={handleClose} centered={true}>
        <Modal.Header closeButton>
          <Modal.Title>Add new translation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose} size="sm">
            CANCEL
          </Button>
          <button className="modal-button-ok">ADD</button>
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
