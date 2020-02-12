import React, { useEffect, useCallback, useRef } from "react";
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
import { useDebouncedCallback } from "use-debounce";

DocumentEditorContainerComponent.Inject(Toolbar);

const EditHook = () => {
  const hostUrl = "https://ej2services.syncfusion.com/production/web-services/";
  let container!: DocumentEditorContainerComponent;
  let titleBar: any;
  let titleBarRef: any = useRef();

  const dispatch = useDispatch();
  const englishTexts = useSelector(
    (state: PatentTranslator) => state.englishTexts
  );
  const uniqueKeys = useSelector((state: PatentTranslator) => state.uniqueKeys);
  const setFoundTexts = useCallback(
    (keys: string[]) => dispatch({ type: SET_FOUND_TEXTS, payload: keys }),
    [dispatch]
  );

  // Delay before search
  const [debouncedCallback] = useDebouncedCallback(() => {
    triggerSearch();
  }, 500);

  useEffect(() => {
    const setUp = () => {
      container.serviceUrl = hostUrl + "api/documenteditor/";
      container.documentEditor.pageOutline = "#E0E0E0";
      container.documentEditor.acceptTab = true;
      container.documentEditor.resize();
      titleBar = new TitleBar(
        titleBarRef.current,
        container.documentEditor,
        true
      );
    };

    setTimeout(() => {
      (async function onLoadDefault() {
        await setUp();
        container.documentEditor.documentName = "Patent Translator";
        titleBar.updateDocumentTitle();
        container.documentEditor.documentChange = () => {
          titleBar.updateDocumentTitle();
          container.documentEditor.focusIn();
        };
      })();
    });
  }, []);

  const searchFor = (text: string): void => {
    container.documentEditor.search.findAll(text);
  };

  const replaceWithThai = (thai: string): void => {
    container.documentEditor.searchModule.searchResults.replace(thai);
    // this.container.documentEditor.searchModule.searchResults.clear();
  };

  const triggerSearch = (): void => {
    let keyList: string[] = [];
    englishTexts.forEach((text: string, index: number) => {
      container.documentEditor.search.findAll(text);
      if (container.documentEditor.searchModule.searchResults.length > 0) {
        console.log(container.documentEditor.searchModule.searchResults.length);
        container.documentEditor.searchModule.searchResults.clear();
        keyList.push(uniqueKeys[index]);
      }
    });
    setFoundTexts(keyList);
  };

  const onContentChange = () => {
    // this.container.documentEditor.selection.characterFormat.highlightColor =
    //   "Pink";
    console.log("Content change triggered");
    debouncedCallback();
  };

  const onDocumentChange = () => {
    console.log("Document change triggered");
  };

  return (
    <div className="control-pane">
      <div className="control-section">
        <div
          ref={titleBarRef}
          id="documenteditor_titlebar"
          className="e-de-ctn-title"
          style={{ background: "#db9e23", fontSize: "1rem" }}
        ></div>
        <div id="documenteditor-container-body">
          <TranslationSideBar
            container={container}
            replaceWithThai={replaceWithThai}
            searchFor={searchFor}
          />
          <DocumentEditorContainerComponent
            // id="container"
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
