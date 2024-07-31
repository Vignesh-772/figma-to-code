// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

import buildRescript from "./BuildDom/CodeGen";
import { RescriptBuildTree } from "./BuildDom/Types";

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage =  (msg: {type: string}) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'generate-code') {
    console.log("generate-code")
    console.log(figma.currentPage.selection)
    const rescriptNode:RescriptBuildTree = {
      type: "View",
      props: {
        props: [],
        styles: []
      },
      childrens: [],
      parent: undefined
    }
    buildRescript(figma.currentPage.selection,rescriptNode)
    // figma.closePlugin();
    // buildRescript()
  } else if (msg.type === 'close') {
    figma.closePlugin();
  }
};