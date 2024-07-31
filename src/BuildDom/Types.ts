export type Props = {
    key: string,
    value: string | number
}

export type DomProps = {
    props: Array<Props>,
    styles: Array<Props>
}

export type RescriptBuildTree = {
    "type": string
    , props: DomProps
    , childrens: Array<RescriptBuildTree | string>
    , parent: RescriptBuildTree | undefined
}