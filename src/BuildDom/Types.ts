export type Props = {
    key: string,
    value: string | number
}

export type DomProps = {
    props: Array<Props>,
    textStyle: Array<Props>,
    styles: Array<Props>
}

export type RescriptBuildTree = {
    "type": string
    , props: DomProps
    , childrens: Array<RescriptBuildTree | string>
    , parent: RescriptBuildTree | undefined
    , kind: 'Node' | 'Child'
    , id : string
}

export type RescriptOutputTree = {
    "type": string
    , props: DomProps
    , childrens: Array<RescriptOutputTree | string>
    , id : string
}

export type TextNodeProps = {
    "type": string
    , props: DomProps
    , childrens: string
    , id : string
    , isConstant: boolean
}