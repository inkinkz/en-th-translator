import React, { useCallback } from "react";
import "./Edit.scss";
import { SampleBase } from "./sample-base";
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

DocumentEditorContainerComponent.Inject(Toolbar);

class Edit extends SampleBase {
  private hostUrl =
    "https://ej2services.syncfusion.com/production/web-services/";
  public container!: DocumentEditorContainerComponent;
  public titleBar: any;
  onLoadDefault: () => void;

  dispatch = useDispatch();
  englishTexts = useSelector((state: PatentTranslator) => state.englishTexts);
  // uniqueKeys = useSelector((state: PatentTranslator) => state.uniqueKeys);
  // setFoundTexts = useCallback(
  //   (keys: string[]) => this.dispatch({ type: SET_FOUND_TEXTS, payload: keys }),
  //   [this.dispatch]
  // );

  constructor() {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0], arguments[1]);

    this.onLoadDefault = () => {
      this.container.documentEditor.documentName = "Patent Translator";
      this.titleBar.updateDocumentTitle();
      this.container.documentEditor.documentChange = () => {
        this.titleBar.updateDocumentTitle();
        this.container.documentEditor.focusIn();
      };
    };
  }

  rendereComplete() {
    this.container.serviceUrl = this.hostUrl + "api/documenteditor/";
    this.container.documentEditor.pageOutline = "#E0E0E0";
    this.container.documentEditor.acceptTab = true;
    this.container.documentEditor.resize();
    this.titleBar = new TitleBar(
      document.getElementById("documenteditor_titlebar"),
      this.container.documentEditor,
      true
    );
    this.onLoadDefault();
  }

  // triggerSearch() {
  //   let keyList: string[] = [];
  //   this.englishTexts.forEach((text: string, index: number) => {
  //     this.container.documentEditor.search.findAll(text);
  //     if (this.container.documentEditor.searchModule.searchResults.length > 0) {
  //       keyList.push(this.uniqueKeys[index]);
  //     }
  //   });

  //   // Found Texts
  //   this.setFoundTexts(keyList);
  // }

  onContentChange() {
    // this.container.documentEditor.search.find("Adventure");
    // this.container.documentEditor.search.findAll("committee");
    // this.container.documentEditor.selection.characterFormat.highlightColor =
    //   "Pink";
    console.log("Content change triggered");

    // let timer: ReturnType<typeof setTimeout> = setTimeout(() => {
    //   this.triggerSearch();
    // }, 500);

    // clearTimeout(timer);
  }

  onDocumentChange() {
    console.log("Document change triggered");
    // this.container.documentEditor.search.find("Adventure");
    // this.container.documentEditor.selection.characterFormat.highlightColor =
    //   "Pink";
  }

  searchFor = (text: string): void => {
    this.container.documentEditor.search.findAll(text);
  };

  replaceWithThai = (thai: string): void => {
    this.container.documentEditor.searchModule.searchResults.replace(thai);
    // this.container.documentEditor.searchModule.searchResults.clear();
  };

  render() {
    return (
      <div className="control-pane">
        <div className="control-section">
          <div
            id="documenteditor_titlebar"
            className="e-de-ctn-title"
            style={{ background: "#db9e23", fontSize: "1rem" }}
          ></div>
          <div id="documenteditor-container-body">
            <TranslationSideBar
              container={this.container}
              replaceWithThai={this.replaceWithThai}
              searchFor={this.searchFor}
            />
            <DocumentEditorContainerComponent
              // id="container"
              className="main-editor"
              ref={scope => {
                this.container = scope!;
              }}
              enableToolbar={true}
              enableLocalPaste={false}
              documentChange={this.onDocumentChange.bind(this)}
              contentChange={this.onContentChange.bind(this)}
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
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withRouter(Edit as any);
