import createSVGWithString from "./Svg"
import { DomTree } from "../Types"
import { Builder } from "../Builder"

export async function getImageNode (builder :Builder, dom: SceneNode, rescriptBuildTree: DomTree) {
    const settings = { format: 'SVG_STRING' } as ExportSettingsSVGString;
    const callback = dom.exportAsync(settings);
    await callback.then((onfulfilled) => {
        if (onfulfilled) {
          createSVGWithString(builder,onfulfilled, dom, rescriptBuildTree)
        } else {
            figma.notify("SVG Creation Failed")
        }
    }).catch((err) => console.log("getImageNode ->", dom, err))
}