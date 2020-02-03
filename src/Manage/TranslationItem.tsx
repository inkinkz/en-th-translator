import React, { useEffect } from "react";
import "./Manage.scss";
import { Tooltip } from "@syncfusion/ej2-popups";

const TranslationItem = (props: { index: number }) => {
  const delToolTip: Tooltip = new Tooltip({
    content: "Delete this translation.",
    position: "LeftCenter"
  });

  useEffect(() => {
    delToolTip.appendTo("#delete");
  }, [delToolTip]);

  return (
    <div className="translation-item">
      <div className="translation">
        <div className="translation-input">
          <input
            type="text"
            placeholder={"This is English translations. " + (props.index + 1)}
          />
        </div>
      </div>
      <div className="translation">
        <div className="translation-input">
          <input
            type="text"
            placeholder={"นี่คือคำแปลภาษาไทย " + (props.index + 1)}
          />
        </div>
        <div id="delete" className="e-icons e-delete"></div>
      </div>
    </div>
  );
};

export default TranslationItem;
