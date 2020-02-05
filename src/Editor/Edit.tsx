import React from "react";
import "./Edit.scss";
import { SampleBase } from "./sample-base";
import {
  DocumentEditorContainerComponent,
  Toolbar
} from "@syncfusion/ej2-react-documenteditor";
import { TitleBar } from "./title-bar.js";
import { withRouter } from "react-router-dom";

DocumentEditorContainerComponent.Inject(Toolbar);

class Edit extends SampleBase {
  private hostUrl =
    "https://ej2services.syncfusion.com/production/web-services/";
  public container!: DocumentEditorContainerComponent;
  public titleBar: any;
  onLoadDefault: () => void;

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

  onContentChange() {
    // this.container.documentEditor.search.find("Adventure");
    // this.container.documentEditor.search.findAll("committee");
    // this.container.documentEditor.search.findAll("adventure");

    // this.container.documentEditor.selection.characterFormat.highlightColor =
    //   "Pink";
    console.log("Content change triggered");
  }

  onDocumentChange() {
    console.log("Document change triggered");
    // this.container.documentEditor.search.find("Adventure");
    // this.container.documentEditor.selection.characterFormat.highlightColor =
    //   "Pink";
  }

  render() {
    return (
      <div className="control-pane">
        {/* <button
          onClick={() => {
            this.container.documentEditor.search.find("insert");
            this.container.documentEditor.selection.characterFormat.highlightColor =
              "Pink";
          }}
        >
          Find All
        </button> */}
        <div className="control-section">
          <div
            id="documenteditor_titlebar"
            className="e-de-ctn-title"
            style={{ background: "#db9e23", fontSize: "1rem" }}
          ></div>
          <div id="documenteditor_container_body">
            <DocumentEditorContainerComponent
              id="container"
              ref={scope => {
                this.container = scope!;
              }}
              style={{ display: "block", height: "calc(100vh - 40px)" }}
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
export default withRouter(Edit as any);
