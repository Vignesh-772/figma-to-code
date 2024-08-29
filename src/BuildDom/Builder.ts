import { DomProps, DomTree, Props } from "./Types";

export type Builder = PropBuilder&DomBuilder;

export interface PropBuilderParams {
    key:string, 
    value:string | number, 
    prefix?: string, 
    unit?:string
}

export interface PropBuilder {
    buildProp(params:PropBuilderParams): Props;
}

export interface DomBuilder {
    getNode(type: string, parent: DomTree | undefined, id: string,): DomTree
    getChild(type: string, parent: DomTree | undefined, id: string,): DomTree
    getTextProps(builder :Builder,dom: SceneNode):DomProps
    getImageNode (builder :Builder, dom: SceneNode, rescriptBuildTree: DomTree):Promise<void>
    getViewProps(builder:Builder,figmaDom: SceneNode,resultDom: DomTree):void
    getDomType(type: string, dom: SceneNode):string
}

