import { Builder, PropBuilderParams } from "../Builder"
import { DomTree, Props } from "../Types"


export class RescriptBuilder implements Builder {
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