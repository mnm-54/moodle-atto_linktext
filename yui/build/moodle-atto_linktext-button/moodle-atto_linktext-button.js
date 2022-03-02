YUI.add('moodle-atto_linktext-button', function (Y, NAME) {

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_linktext
 * @copyright  shahriar
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_linktext-button
 */

/**
 * Atto text editor linktext plugin.
 *
 * @namespace M.atto_linktext
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

var COMPONENTNAME = "atto_linktext";
var LOGNAME = "atto_linktext";
var DESCRIPTION = "linktext_description";
var TITLE = "linktext_title";

var CSS = {
    INPUTSUBMIT: "atto_media_urlentrysubmit",
    INPUTCANCEL: "atto_media_urlentrycancel",
    LINK: "link",
    TITLE: "title",
    DESCRIPTION: "description",
  },
  SELECTORS = {
    LINK: ".link",
    TITLE: ".title",
    DESCRIPTION: ".description",
  };

var TEMPLATE =
  "" +
  '<form class="atto_form">' +
  '<div id="{{elementid}}_{{innerform}}" class="mdl-align">' +
  '<label for="{{elementid}}_{{LINK}}">{{get_string "enterlink" component}}</label>' +
  '<input class="{{CSS.LINK}}" id="{{elementid}}_{{LINK}}" name="{{elementid}}_{{LINK}}" value="" />' +
  "<br />" +
  '<label for="{{elementid}}_{{TITLE}}">{{get_string "entertitle" component}}</label>' +
  '<input class="{{CSS.TITLE}}" id="{{elementid}}_{{TITLE}}" name="{{elementid}}_{{TITLE}}" value="{{selectedtext}}" />' +
  "<br />" +
  '<label for="{{elementid}}_{{description}}">{{get_string "enterdesc" component}}</label>' +
  '<input class="{{CSS.DESCRIPTION}}" id="{{elementid}}_{{description}}" name="{{elementid}}_{{description}}" value="" />' +
  "<br />" +
  '<button class="{{CSS.INPUTSUBMIT}}">{{get_string "insert" component}}</button>' +
  "</div>" +
  "icon: {{clickedicon}}" +
  "</form>";

Y.namespace("M.atto_linktext").Button = Y.Base.create(
  "button",
  Y.M.editor_atto.EditorPlugin,
  [],
  {
    /**
     * A reference to the current selection at the time that the dialogue
     * was opened.
     *
     * @property _currentSelection
     * @type Range
     * @private
     */
    _currentSelection: null,

    /**
     * Initialize the button
     *
     * @method Initializer
     */
    initializer: function () {
      // If we don't have the capability to view then give up.
      if (this.get("disabled")) {
        return;
      }

      var icons = ["externallink"];

      Y.Array.each(
        icons,
        function (theicon) {
          // Add the linktext icon/buttons
          this.addButton({
            icon: "ed/" + theicon,
            iconComponent: "atto_linktext",
            buttonName: theicon,
            callback: this._displayDialogue,
            callbackArgs: theicon,
          });
        },
        this
      );
    },

    /**
     * Display the linktext Dialogue
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function (e, clickedicon) {
      e.preventDefault();
      var width = 400;

      var dialogue = this.getDialogue({
        headerContent: M.util.get_string("dialogtitle", COMPONENTNAME),
        width: width + "px",
        focusAfterHide: clickedicon,
      });
      //dialog doesn't detect changes in width without this
      //if you reuse the dialog, this seems necessary
      if (dialogue.width !== width + "px") {
        dialogue.set("width", width + "px");
      }

      //append buttons to iframe
      var buttonform = this._getFormContent(clickedicon);

      var bodycontent = Y.Node.create("<div></div>");
      bodycontent.append(buttonform);

      //set to bodycontent
      dialogue.set("bodyContent", bodycontent);
      dialogue.show();
      this.markUpdated();
    },

    /**
     * Return the dialogue content for the tool, attaching any required
     * events.
     *
     * @method _getDialogueContent
     * @return {Node} The content to place in the dialogue.
     * @private
     */
    _getFormContent: function (clickedicon) {
      // Store the current selection.
      this._currentSelection = this.get("host").getSelection();

      var template = Y.Handlebars.compile(TEMPLATE),
        content = Y.Node.create(
          template({
            elementid: this.get("host").get("elementid"),
            CSS: CSS,
            component: COMPONENTNAME,
            clickedicon: clickedicon,
            selectedtext: this._currentSelection,
          })
        );

      this._form = content;
      this._form.one("." + CSS.INPUTSUBMIT).on("click", this._doInsert, this);
      return content;
    },

    /**
     * Inserts the users input onto the page
     * @method _getDialogueContent
     * @private
     */
    _doInsert: function (e) {
      e.preventDefault();
      this.getDialogue({
        focusAfterHide: null,
      }).hide();

      var link = this._form.one(SELECTORS.LINK);
      var title = this._form.one(SELECTORS.TITLE);
      var description = this._form.one(SELECTORS.DESCRIPTION);

      var titlevalue = title.get("value");

      // If no file is there to insert, don't do it.
      if (!link.get("value")) {
        return;
      }
      if (!title.get("value")) {
        titlevalue = link.get("value");
      }
      var output =
        "<a class='" +
        this.get("defaultlinkcss") +
        "'href='http://" +
        link.get("value") +
        "' target='_blank' title='" +
        description.get("value") +
        "'>" +
        titlevalue +
        "</a>";
      this.editor.focus();
      this.get("host").insertContentAtFocusPoint(output);
      this.markUpdated();
    },
  },
  {
    ATTRS: {
      disabled: {
        value: false,
      },

      usercontextid: {
        value: null,
      },

      defaultlinkcss: {
        value: "",
      },
    },
  }
);


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
