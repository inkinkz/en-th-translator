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
import { PatentTranslator } from "../../shared/types";
import { SET_FOUND_TEXTS } from "../../shared/redux/actions";
import { FoundText } from "../../shared/types";

DocumentEditorContainerComponent.Inject(Toolbar);

const EditHook = () => {
  const hostUrl = "https://ej2services.syncfusion.com/production/web-services/";
  let container!: DocumentEditorContainerComponent;

  const [currentWord, setCurrentWord] = useState("");

  const [showLoading, setShowLoading] = useState(false);

  const titleBar: any = useRef(null);
  const editorRef: any = useRef();

  const dispatch = useDispatch();
  const englishTexts = useSelector(
    (state: PatentTranslator) => state.englishTexts
  );
  const uniqueKeysSortByUseCount = useSelector(
    (state: PatentTranslator) => state.uniqueKeysSortByUseCount
  );

  const setFoundTexts = useCallback(
    (keys: FoundText[]) => dispatch({ type: SET_FOUND_TEXTS, payload: keys }),
    [dispatch]
  );

  const [finished, setFinished] = useState(false);

  const search = (move: boolean) => {
    setShowLoading(true);
    const ct = container;
    setTimeout(
      async () => {
        await triggerSearch(move, ct);
        setShowLoading(false);
      },
      200,
      ct
    );
  };

  const triggerSearch = async (
    move: boolean,
    container: DocumentEditorContainerComponent
  ): Promise<void> => {
    const keyList: FoundText[] = [];
    if (container !== null) {
      englishTexts.forEach((text: string, index: number) => {
        container.documentEditor.search.findAll(text);

        if (container.documentEditor.searchModule.searchResults.length > 0) {
          const count = +container.documentEditor.searchModule.searchResults
            .length;
          container.documentEditor.searchModule.searchResults.clear();
          keyList.push({
            word: uniqueKeysSortByUseCount[index],
            count,
          });
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
        // triggerSearch(true);
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
    container.documentEditor.searchModule.findAll(text);
  };

  const replaceWithThai = (thai: string): void => {
    container.documentEditor.searchModule.searchResults.replace(thai);

    const editor = container.documentEditor;

    setTimeout(
      () => {
        editor.search.findAll(thai);

        const count = +editor.searchModule.searchResults.length;

        moveToLastOccurrance(thai, count, editor);

        // editor.searchModule.searchResults.clear();
      },
      100,
      editor
    );
  };

  const moveToLastOccurrance = (
    text: string,
    count: number,
    editor: any
  ): void => {
    for (let index = 0; index < count; index++) {
      editor.searchModule.findAll(text);
    }
  };

  const replaceAll = (thai: string): void => {
    const editor = container.documentEditor;
    if (editor) {
      editor.searchModule.searchResults.replaceAll(thai);
      triggerSearch(false, container);
      setTimeout(
        () => {
          editor.searchModule.findAll(thai);
        },
        500,
        editor
      );
    }
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

    if (text.length > 1) {
      setCurrentWord(container.documentEditor.selection.text.trim());
      const found: FoundText[] = [];
      englishTexts.forEach((englishText: string, index: number) => {
        // Check perfect match
        if (englishText.toLowerCase() === text.toLowerCase()) {
          found.push({
            word: uniqueKeysSortByUseCount[index],
            count: 0,
          });
        }
        // Check for includes
        // if (englishText.toLowerCase().includes(text.toLowerCase())) {
        //   found.push({
        //     word: uniqueKeysSortByUseCount[index],
        //     count: 1,
        //   });
        // }
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
            loading={showLoading}
            container={container}
            replaceWithThai={replaceWithThai}
            replaceAll={replaceAll}
            searchFor={searchFor}
            triggerSearch={search}
            // triggerSearch={triggerSearch}
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
      {/* <script>
        {
          (window.onbeforeunload = () => {
            return "Did you save your changes?";
          })
        }
      </script> */}
      {/*  */}
    </div>
  );
};

export default withRouter(EditHook);
