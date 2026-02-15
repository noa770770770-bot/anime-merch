// Canonical page model for the site editor (Wix-style)
// Each page is an array of sections, each section has containers, each container has elements
// Each element has id, type, props, layout, style, etc.

export type PageModel = {
  id: string;
  sections: SectionModel[];
};

export type SectionModel = {
  id: string;
  type: 'section';
  layout: LayoutModel;
  style: StyleModel;
  containers: ContainerModel[];
};

export type ContainerModel = {
  id: string;
  type: 'container';
  layout: LayoutModel;
  style: StyleModel;
  elements: ElementModel[];
};

export type ElementModel = {
  id: string;
  type: 'text' | 'image' | 'button' | 'product' | 'custom';
  props: Record<string, any>;
  layout: LayoutModel;
  style: StyleModel;
};

export type LayoutModel = {
  x: number;
  y: number;
  width: number;
  height: number;
  anchors?: string[];
  responsive?: boolean;
};

export type StyleModel = {
  font?: string;
  color?: string;
  background?: string;
  border?: string;
  borderRadius?: number;
  boxShadow?: string;
  [key: string]: any;
};

export type EditorState = {
  page: PageModel;
  selectedId: string | null;
  history: PageModel[];
  future: PageModel[];
  isDragging: boolean;
  dragPreview: null | { id: string; x: number; y: number };
};
