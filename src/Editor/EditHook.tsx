/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useCallback, useRef, useState } from "react";
import "./Edit.scss";
import {
  DocumentEditorContainerComponent,
  Toolbar
} from "@syncfusion/ej2-react-documenteditor";
import { TitleBar } from "./title-bar.js";
import { withRouter } from "react-router-dom";
import TranslationSideBar from "./TranslationSideBar";
import { useDispatch, useSelector } from "react-redux";
import { PatentTranslator } from "../redux/types";
import { SET_FOUND_TEXTS } from "../redux/actions";
// import { useDebouncedCallback } from "use-debounce";

DocumentEditorContainerComponent.Inject(Toolbar);

const EditHook = () => {
  const hostUrl = "https://ej2services.syncfusion.com/production/web-services/";
  let container!: DocumentEditorContainerComponent;
  const titleBar: any = useRef(null);

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
    console.log("triggerSearch()");
    const keyList: string[] = [];
    if (container !== null) {
      englishTexts.forEach((text: string, index: number) => {
        container.documentEditor.search.findAll(text);
        if (container.documentEditor.searchModule.searchResults.length > 0) {
          container.documentEditor.searchModule.searchResults.clear();
          keyList.push(uniqueKeysSortByUseCount[index]);
        }
      });
      // console.log(keyList);
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
      // console.log("newTitleBar");
      titleBar.current = new TitleBar(
        titleBar.current,
        container.documentEditor,
        true
      );
      // console.log("rerdereComplete()");
    };

    const onLoadDefault = () => {
      container.documentEditor.documentName = "Patent Translator";
      titleBar.current.updateDocumentTitle();
      // console.log("onLoadDefault()");
    };

    const onDocumentLoad = () => {
      container.documentEditor.documentChange = () => {
        titleBar.current.updateDocumentTitle();
        // container.documentEditor.focusIn();
        console.log("onDocumentLoad");
        triggerSearch(true);
      };
    };

    setTimeout(() => {
      // console.log("setTimeout()");
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
    // container.documentEditor.searchModule.searchResults.clear();
  };

  // Delay before search
  // const [debouncedCallback] = useDebouncedCallback(() => {
  //   triggerSearch(false);
  // }, 1000);

  const onContentChange = () => {
    // debouncedCallback();
    console.log("content change");
  };

  const onDocumentChange = () => {
    console.log("Document change triggered");
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
        <div id="documenteditor-container-body">
          <TranslationSideBar
            container={container}
            replaceWithThai={replaceWithThai}
            searchFor={searchFor}
            triggerSearch={triggerSearch}
          />
          <DocumentEditorContainerComponent
            id="container"
            className="main-editor"
            ref={scope => {
              container = scope!;
            }}
            enableToolbar={true}
            enableLocalPaste={false}
            documentChange={onDocumentChange}
            contentChange={onContentChange}
          />
        </div>
      </div>
      {/* <script>
        {
          (window.onbeforeunload = function() {
            return "Want to save your changes?";
          })
        }
      </script> */}
    </div>
  );
};

export default withRouter(EditHook as any);
