import { Builder, PropBuilderParams } from "../Builder"
import { DomProps, DomTree, Props } from "../Types"
import { isImageNode } from "../Utils";
import { getImageNode } from "./Image";
import getTextProps from "./Text"
import getViewProps from "./View";


export class RescriptBuilder implements Builder {
    getTextProps(builder: Builder, dom: SceneNode): DomProps {
      return getTextProps(builder,dom);
    }
    getImageNode(builder: Builder, dom: SceneNode, rescriptBuildTree: DomTree): Promise<void> {
      return getImageNode(builder,dom,rescriptBuildTree);
    }
    getViewProps(builder: Builder, figmaDom: SceneNode, resultDom: DomTree): void {
      return getViewProps(builder,figmaDom,resultDom)
    }
    getDomType(type: string, dom: SceneNode): string {
        switch (type) {
          case "TEXT": return "Text"
          default: return isImageNode(dom) ? "Svg.SvgXml" : "View"
        }
    }
    getNode(type: string, parent: DomTree | undefined, id: string,): DomTree {
        return {
            type: type,
            props: {
              props: [],
              textStyle: [],
              styles: []
            },
            childrens: [],
            parent: parent,
            id : id,
            kind: "Node"
          }
    }
    getChild(type: string, parent: DomTree | undefined, id: string,): DomTree {
        return {
            type: type,
            props: {
              props: [],
              textStyle: [],
              styles: []
            },
            childrens: [],
            parent: parent,
            id : id,
            kind: "Child"
          }
    }
    buildProp({key, value, prefix="~", unit=""}:PropBuilderParams): Props {
        return {
            key : key,
            value:value,
            prefix:prefix,
            unit:unit
        }
    }
}