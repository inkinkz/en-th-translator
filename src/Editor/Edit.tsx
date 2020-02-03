import React from "react";
import "./Edit.scss";
import { SampleBase } from "./sample-base";
import {
  DocumentEditorContainerComponent,
  Toolbar,
  ContainerContentChangeEventArgs
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
    this.contentChange = this.contentChange.bind(this);
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
  contentChange(event: ContainerContentChangeEventArgs | undefined) {
    console.log(event);
    // alert(event);
  }
  //   onImportClick() {
  //     document.getElementById('file_upload').click();
  // }

  // loadFile(file) {
  //   let ajax = new XMLHttpRequest();
  //   ajax.open('POST', 'https://localhost:3000/api/documenteditor/Import', true);
  //   ajax.onreadystatechange = () => {
  //       if (ajax.readyState === 4) {
  //           if (ajax.status === 200 || ajax.status === 304) {
  //               // open SFDT text in document editor
  //               this.documenteditor.open(ajax.responseText);
  //           }
  //       }
  //   };
  //   let formData = new FormData();
  //   formData.append('files', file);
  //   ajax.send(formData);
  // }

  // onFileChange(e) {
  //     if (e.target.files[0]) {
  //         let file = e.target.files[0];
  //         if (file.name.substr(file.name.lastIndexOf('.')) !== '.sfdt') {
  //             this.loadFile(file);
  //         }
  //     }
  // }

  render() {
    return (
      // <div>
      //  <input type="file" id="file_upload" accept=".dotx,.docx,.docm,.dot,.doc,.rtf,.txt,.xml,.sfdt" onChange={this.onFileChange.bind(this)}/>
      //   <button onClick={this.onImportClick.bind(this)}>Import</button>
      <div className="control-pane">
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
              contentChange={e => this.contentChange(e)}
              locale="en-US"
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

        {/* </div> */}
      </div>
    );
  }
}
export default withRouter(Edit as any);
