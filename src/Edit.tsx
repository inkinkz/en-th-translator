import React, { useState } from "react";
import "./App.scss";
import { Editor, EditorState } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Edit = () => {
  const [editorState, setEditorState] = useState<EditorState>();
  return (
    <div style={{ backgroundColor: "white", overflow: "hidden" }}>
      <div>
        <button onClick={() => (window.location.href = "/")}> Home</button>
      </div>
      <div style={{ backgroundColor: "white" }}>
        <Editor
          editorState={editorState}
          toolbarClassName="editorToolbar"
          wrapperClassName="editorWrapper"
          editorClassName="editor"
          onEditorStateChange={text => setEditorState(text)}
        />
      </div>
    </div>
  );
};

export default Edit;
