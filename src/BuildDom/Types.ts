export type Props = {
    key: string,
    value: string | number
    unit: string,
    prefix: string
}

export type DomProps = {
    props: Array<Props>,
    textStyle: Array<Props>,
    styles: Array<Props>
}

export type DomTree = {
    "type": string
    , props: DomProps
    , childrens: Array<DomTree | string>
    , parent: DomTree | undefined
    , kind: 'Node' | 'Child'
    , id: string
}

export type OutputTree = {
    "type": string
    , props: DomProps
    , childrens: Array<OutputTree | string>
    , id: string
}

export type TextNodeProps = {
    "type": string
    , props: DomProps
    , childrens: string
    , id: string
    , isConstant: boolean
}

export enum Language {
    Rescript
    , TypeScript
    , Javascript
}

