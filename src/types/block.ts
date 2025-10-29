import { BlockType } from "@/generated/prisma";


export type LinkBlockProperties = {
  url: string;
  title: string;
};

export type HeadingBlockProperties = {
  text: string;
};

interface BaseBlock  { 
    id: string
    order: number
}

// export interface BlockType {
//   LINK: typeof BlockType.LINK
//   HEADING: typeof BlockType.HEADING
// }

export interface LinkBlock extends BaseBlock {
    type: typeof BlockType.LINK
    properties: LinkBlockProperties
}

export interface HeadingBlock extends BaseBlock {
    type: typeof BlockType.HEADING
    properties: HeadingBlockProperties
}

export type AppBlock = LinkBlock | HeadingBlock