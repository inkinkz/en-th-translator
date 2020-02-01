import React from "react";
import "./Manage.scss";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { withRouter } from "react-router-dom";

// Render each translation
const Row = ({ data, index, style }: any) => (
  // <div
  //   style={style}
  //   className="glossary-row"
  //   onClick={() => console.log("Clicked")}
  // >
  <div style={style} className="translation-item">
    <div className="translation">
      <div className="translation-input">
        <input
          type="text"
          placeholder={"This is English translations. " + (index + 1)}
        />
      </div>
    </div>
    <div className="translation">
      <div className="translation-input">
        <input type="text" placeholder={"นี่คือคำแปลภาษาไทย " + (index + 1)} />
      </div>
    </div>
  </div>
  // </div>
);

const Manage = (props: any) => {
  return (
    <div id="manage-translations">
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
            </div>
          </div>
          <div className="translation-items-container">
            <div className="auto-sizer">
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    style={{ overflowX: "hidden" }}
                    height={height - 50}
                    itemCount={50}
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
