/* eslint-disable @typescript-eslint/no-this-alias */
import * as ej2_base_1 from "@syncfusion/ej2-base";
import * as ej2_buttons_1 from "@syncfusion/ej2-buttons";
import * as ej2_splitbuttons_1 from "@syncfusion/ej2-splitbuttons";

/**
 * Represents document editor title bar.
 */

export const TitleBar = /** @class */ (function() {
  function TitleBar(element, docEditor, isShareNeeded, isRtl) {
    const _this = this;
    this.initializeTitleBar = function(isShareNeeded) {
      let downloadText;
      let downloadToolTip;
      let printText;
      let printToolTip;
      let homeText;
      let homeToolTip;
      let manageText;
      let manageToolTip;
      let openText;
      let documentTileText;
      if (!_this.isRtl) {
        downloadText = "Download";
        downloadToolTip = "Download this document.";
        printText = "Print";
        printToolTip = "Print this document (Ctrl+P).";
        homeText = "Home";
        homeToolTip = "Back to Home Page";
        manageText = "Manage Translations";
        manageToolTip = "To Manage Translation Page";
        openText = "Open";
        documentTileText =
          "Document Name. Click or tap to rename this document.";
      } else {
        downloadText = "Download";
        downloadToolTip = "Download this document.";
        printText = "Print";
        printToolTip = "Print this document (Ctrl+P).";
        openText = "Open";
        documentTileText =
          "Document Name. Click or tap to rename this document.";
      }
      // tslint:disable-next-line:max-line-length
      _this.documentTitle = ej2_base_1.createElement("label", {
        id: "documenteditor_title_name",
        styles:
          "font-weight:400;text-overflow:ellipsis;white-space:pre;overflow:hidden;user-select:none;cursor:text"
      });
      let iconCss = "e-de-padding-right";
      let btnFloatStyle = "float:right;";
      let titleCss = "";
      if (_this.isRtl) {
        iconCss = "e-de-padding-right-rtl";
        btnFloatStyle = "float:left;";
        titleCss = "float:right;";
      }
      // tslint:disable-next-line:max-line-length
      _this.documentTitleContentEditor = ej2_base_1.createElement("div", {
        id: "documenteditor_title_contentEditor",
        className: "single-line",
        styles: titleCss
      });
      _this.documentTitleContentEditor.appendChild(_this.documentTitle);
      _this.tileBarDiv.appendChild(_this.documentTitleContentEditor);
      _this.documentTitleContentEditor.setAttribute("title", documentTileText);
      const btnStyles =
        btnFloatStyle +
        "background: transparent;box-shadow:none; font-family: inherit;border-color: transparent;" +
        "border-radius: 2px;color:inherit;font-size:14px;text-transform:capitalize;height:28px;font-weight:400;margin-top: 2px;";

      _this.manage = _this.addButton(
        iconCss,
        manageText,
        btnStyles,
        "de-print",
        manageToolTip,
        false
      );
      _this.home = _this.addButton(
        iconCss,
        homeText,
        btnStyles,
        "de-print",
        homeToolTip,
        false
      );
      _this.print = _this.addButton(
        "e-de-icon-Print " + iconCss,
        printText,
        btnStyles,
        "de-print",
        printToolTip,
        false
      );
      _this.open = _this.addButton(
        "e-de-icon-Open " + iconCss,
        openText,
        btnStyles,
        "de-open",
        openText,
        false
      );
      const items = [
        { text: "Microsoft Word (.docx)", id: "word" },
        { text: "Syncfusion Document Text (.sfdt)", id: "sfdt" }
      ];
      // tslint:disable-next-line:max-line-length
      _this.export = _this.addButton(
        "e-de-icon-Download " + iconCss,
        downloadText,
        btnStyles,
        "documenteditor-share",
        downloadToolTip,
        true,
        items
      );
      if (!isShareNeeded) {
        _this.export.element.style.display = "none";
      } else {
        _this.open.element.style.display = "none";
      }
    };
    this.wireEvents = function() {
      _this.print.element.addEventListener("click", _this.onPrint);
      _this.home.element.addEventListener("click", _this.onHome);
      _this.manage.element.addEventListener("click", _this.onManage);
      _this.open.element.addEventListener("click", function(e) {
        if (e.target.id === "de-open") {
          const fileUpload = document.getElementById("uploadfileButton");
          fileUpload.value = "";
          fileUpload.click();
        }
      });
      _this.documentTitleContentEditor.addEventListener("keydown", function(e) {
        if (e.keyCode === 13) {
          e.preventDefault();
          _this.documentTitleContentEditor.contentEditable = "false";
          if (_this.documentTitleContentEditor.textContent === "") {
            _this.documentTitleContentEditor.textContent = "Document1";
          }
        }
      });
      _this.documentTitleContentEditor.addEventListener("blur", function() {
        if (_this.documentTitleContentEditor.textContent === "") {
          _this.documentTitleContentEditor.textContent = "Document1";
        }
        _this.documentTitleContentEditor.contentEditable = "false";
        _this.documentEditor.documentName = _this.documentTitle.textContent;
      });
      _this.documentTitleContentEditor.addEventListener("click", function() {
        _this.updateDocumentEditorTitle();
      });
    };
    this.updateDocumentEditorTitle = function() {
      _this.documentTitleContentEditor.contentEditable = "true";
      _this.documentTitleContentEditor.focus();
      window.getSelection().selectAllChildren(_this.documentTitleContentEditor);
    };
    // Updates document title.
    this.updateDocumentTitle = function() {
      if (_this.documentEditor.documentName === "") {
        _this.documentEditor.documentName = "Untitled";
      }
      _this.documentTitle.textContent = _this.documentEditor.documentName;
    };
    this.onPrint = function() {
      _this.documentEditor.print();
    };
    this.onHome = function() {
      window.location.href = "#/";
    };
    this.onManage = function() {
      window.location.href = "#/manage";
    };
    this.onExportClick = function(args) {
      const value = args.item.id;
      switch (value) {
        case "word":
          _this.save("Docx");
          break;
        case "sfdt":
          _this.save("Sfdt");
          break;
        default:
          break;
      }
    };
    this.save = function(format) {
      // tslint:disable-next-line:max-line-length
      _this.documentEditor.save(
        _this.documentEditor.documentName === ""
          ? "sample"
          : _this.documentEditor.documentName,
        format
      );
    };
    //initializes title bar elements.
    this.tileBarDiv = element;
    this.documentEditor = docEditor;
    this.isRtl = isRtl;
    this.initializeTitleBar(isShareNeeded);
    this.wireEvents();
  }
  TitleBar.prototype.setTooltipForPopup = function() {
    // tslint:disable-next-line:max-line-length
    document
      .getElementById("documenteditor-share-popup")
      .querySelectorAll("li")[0]
      .setAttribute(
        "title",
        "Download a copy of this document to your computer as a DOCX file."
      );
    // tslint:disable-next-line:max-line-length
    document
      .getElementById("documenteditor-share-popup")
      .querySelectorAll("li")[1]
      .setAttribute(
        "title",
        "Download a copy of this document to your computer as an SFDT file."
      );
  };
  // tslint:disable-next-line:max-line-length
  TitleBar.prototype.addButton = function(
    iconClass,
    btnText,
    styles,
    id,
    tooltipText,
    isDropDown,
    items
  ) {
    const _this = this;
    const button = ej2_base_1.createElement("button", {
      id: id,
      styles: styles
    });
    this.tileBarDiv.appendChild(button);
    button.setAttribute("title", tooltipText);
    if (isDropDown) {
      // tslint:disable-next-line:max-line-length
      const dropButton = new ej2_splitbuttons_1.DropDownButton(
        {
          select: this.onExportClick,
          items: items,
          iconCss: iconClass,
          cssClass: "e-caret-hide",
          content: btnText,
          open: function() {
            _this.setTooltipForPopup();
          }
        },
        button
      );
      return dropButton;
    } else {
      const ejButton = new ej2_buttons_1.Button(
        { iconCss: iconClass, content: btnText },
        button
      );
      return ejButton;
    }
  };
  return TitleBar;
})();
