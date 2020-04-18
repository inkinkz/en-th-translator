import React, { useState } from "react";
import "./TranslationSideBar.scss";
import { DocumentEditorContainerComponent } from "@syncfusion/ej2-react-documenteditor";
import { useSelector } from "react-redux";
import { PatentTranslator } from "../../shared/redux/types";
import TranslationSideBarItem from "./TranslationSideBarItem";
import AddTranslationModal from "../AddTranslationModal/AddTranslationModal";

const TranslationSideBar = (props: {
  container: DocumentEditorContainerComponent;
  currentWord: string;
  searchFor: (text: string) => void;
  replaceWithThai: (text: string) => void;
  replaceAll: (text: string) => void;
  triggerSearch: (move: boolean) => void;
}) => {
  const [show, setShow] = useState(false);

  const foundTexts = useSelector((state: PatentTranslator) => state.foundTexts);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  return (
    <div className="suggestion-panel">
      <AddTranslationModal show={show} handleClose={handleClose} />

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
};

export default TranslationSideBar;
