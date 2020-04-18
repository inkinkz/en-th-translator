/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useCallback, useRef, useState } from "react";
import "./Edit.scss";
import {
  DocumentEditorContainerComponent,
  Toolbar,
} from "@syncfusion/ej2-react-documenteditor";
import { TitleBar } from "./title-bar.js";
import { withRouter } from "react-router-dom";
import TranslationSideBar from "../../components/TranslationSideBar/TranslationSideBar";
import { useDispatch, useSelector } from "react-redux";
import { PatentTranslator } from "../../shared/redux/types";
import { SET_FOUND_TEXTS } from "../../shared/redux/actions";

DocumentEditorContainerComponent.Inject(Toolbar);

const EditHook = () => {
  const hostUrl = "https://ej2services.syncfusion.com/production/web-services/";
  let container!: DocumentEditorContainerComponent;
  const titleBar: any = useRef(null);

  const [currentWord, setCurrentWord] = useState("");
  const editorRef: any = useRef();

  const dispatch = useDispatch();
  const englishTexts = useSelector(
    (state: PatentTranslator) => state.englishTexts
  );
  const uniqueKeysSortByUseCount = useSelector(
    (state: PatentTranslator) => state.uniqueKeysSortByUseCount
  );

  const setFoundTexts = useCallback(
    (keys: string[]) => dispatch({ type: SET_FOUND_TEXTS, payload: keys }),
    [dispatch]
  );

  const [finished, setFinished] = useState(false);

  const triggerSearch = (move: boolean): void => {
    const keyList: string[] = [];
    if (container !== null) {
      englishTexts.forEach((text: string, index: number) => {
        container.documentEditor.search.findAll(text);
        if (container.documentEditor.searchModule.searchResults.length > 0) {
          console.log(
            text +
              " (Found " +
              container.documentEditor.searchModule.searchResults.length +
              " times.)"
          );
          container.documentEditor.searchModule.searchResults.clear();
          keyList.push(uniqueKeysSortByUseCount[index]);
        }
      });
      if (move) container.documentEditor.selection.moveToDocumentStart();

      setFoundTexts(keyList);
    }
  };

  useEffect(() => {
    const rendereComplete = () => {
      container.serviceUrl = hostUrl + "api/documenteditor/";
      container.documentEditor.pageOutline = "#E0E0E0";
      container.documentEditor.acceptTab = true;
      container.documentEditor.resize();
      titleBar.current = new TitleBar(
        titleBar.current,
        container.documentEditor,
        true
      );
    };

    const onLoadDefault = () => {
      container.documentEditor.documentName = "Patent Translator";
      titleBar.current.updateDocumentTitle();
    };

    const onDocumentLoad = () => {
      container.documentEditor.documentChange = () => {
        titleBar.current.updateDocumentTitle();
        triggerSearch(true);
      };
    };

    setTimeout(() => {
      if (!finished) {
        rendereComplete();
        onLoadDefault();
        onDocumentLoad();
        setFinished(true);
      }
    });

    // eslint-disable-next-line
  }, [container]);

  const searchFor = (text: string): void => {
    container.documentEditor.search.findAll(text);
  };

  const replaceWithThai = (thai: string): void => {
    container.documentEditor.searchModule.searchResults.replace(thai);
    container.documentEditor.searchModule.searchResults.clear();
    container.documentEditor.search.find(thai);
  };

  const replaceAll = (thai: string): void => {
    container.documentEditor.searchModule.searchResults.replaceAll(thai);
    triggerSearch(false);
    // container.documentEditor.searchModule.searchResults.clear();
  };

  // Delay before search
  // const [debouncedCallback] = useDebouncedCallback(() => {
  //   triggerSearch(false);
  // }, 1000);

  // Search for translation when typing
  // const onContentChange = () => {
  //   // debouncedCallback();
  // };

  const onDocumentChange = () => {
    console.log("Document change triggered");
    setFoundTexts([]);
  };

  const selectedText = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();
    const text = container.documentEditor.selection.text.toLowerCase().trim();
    setCurrentWord(container.documentEditor.selection.text.trim());
    if (text.length > 1) {
      const found: string[] = [];
      englishTexts.forEach((englishText: string, index: number) => {
        if (englishText.toLowerCase().includes(text.toLowerCase())) {
          found.push(uniqueKeysSortByUseCount[index]);
        }
      });
      setFoundTexts(found);
    }
  };

  return (
    <div className="control-pane">
      <div className="control-section">
        <div
          ref={titleBar}
          id="documenteditor_titlebar"
          className="e-de-ctn-title"
          style={{ background: "#db9e23", fontSize: "1rem" }}
        ></div>
        <div id="documenteditor-container-body" ref={editorRef}>
          <TranslationSideBar
            container={container}
            replaceWithThai={replaceWithThai}
            replaceAll={replaceAll}
            searchFor={searchFor}
            triggerSearch={triggerSearch}
            currentWord={currentWord}
          />
          <div onMouseUp={(e) => selectedText(e)}>
            <DocumentEditorContainerComponent
              id="container"
              className="main-editor"
              ref={(scope) => {
                container = scope!;
              }}
              enableToolbar={true}
              enableLocalPaste={false}
              documentChange={onDocumentChange}
              // contentChange={onContentChange}
            />
          </div>
        </div>
      </div>

      {/* Remove when build Electron */}
      <script>
        {
          (window.onbeforeunload = () => {
            return "Did you save your changes?";
          })
        }
      </script>
      {/*  */}
    </div>
  );
};

export default withRouter(EditHook);
