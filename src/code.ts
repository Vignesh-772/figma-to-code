// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
/// <reference types="@figma/plugin-typings/plugin-api" />

import { buildDomTree } from "./BuildDom/CodeGen";
import { Language } from "./BuildDom/Types";

declare global {
  const figma: PluginAPI
  const __html__: string
  const __uiFiles__: {
    [key: string]: string
  }
}

export { }

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 520, height: 520 })

export const globalCache:{parentNode: {height : number, width: number}| null} = {parentNode:null}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage =  async (msg: {type: string}) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'generate-code') {
    buildDomTree(figma.currentPage.selection, Language.Rescript)
  } else if (msg.type === 'close') {
    figma.closePlugin();
  } else if (msg.type === 'notify-copy') {
    figma.notify("Copied")
  }
};