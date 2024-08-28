import { DomTree, Props } from "./Types";

export type Builder = PropBuilder&DomNodeBuilder;

export interface PropBuilderParams {
    key:string, 
    value:string | number, 
    prefix?: string, 
    unit?:string
}

export interface PropBuilder {
    buildProp(params:PropBuilderParams): Props;
}

export interface DomNodeBuilder {
    getNode(type: string, parent: DomTree | undefined, id: string,): DomTree
    getChild(type: string, parent: DomTree | undefined, id: string,): DomTree
}