// Canonical Page Model and Zod schema for Wix-style editor
import { z } from "zod";

export type NodeId = string;
export type Breakpoint = "desktop" | "tablet" | "mobile";
export type Rect = { x: number; y: number; w: number; h: number };

export type Fill =
  | { kind: "color"; value: string }
  | { kind: "image"; src: string; fit: "cover" | "contain" | "tile" }
  | { kind: "video"; src: string; poster?: string };

export type ElementType = "text" | "image" | "button" | "container";

export type ElementNode = {
  id: NodeId;
  type: ElementType;
  parentId: NodeId | null;
  frame: Record<Breakpoint, Rect>;
  style: {
    opacity?: number;
    radius?: number;
    border?: { width: number; color: string };
    shadow?: { blur: number; x: number; y: number; color: string };
    text?: { fontFamily: string; fontSize: number; fontWeight: number; color: string; align: "left"|"center"|"right" };
    fill?: Fill;
  };
  props: Record<string, any>; // e.g. text string, href, alt, etc.
};

export type PageModel = {
  id: string;
  title: string;
  rootId: NodeId;
  nodes: Record<NodeId, ElementNode>;
  background: {
    fill: Fill;
    overlay?: { color: string; opacity: number };
  };
};

// Zod schema for validation
export const FillSchema = z.union([
  z.object({ kind: z.literal("color"), value: z.string() }),
  z.object({ kind: z.literal("image"), src: z.string(), fit: z.enum(["cover", "contain", "tile"]) }),
  z.object({ kind: z.literal("video"), src: z.string(), poster: z.string().optional() })
]);

export const ElementNodeSchema = z.object({
  id: z.string(),
  type: z.enum(["text", "image", "button", "container"]),
  parentId: z.string().nullable(),
  frame: z.record(z.enum(["desktop", "tablet", "mobile"]), z.object({ x: z.number(), y: z.number(), w: z.number(), h: z.number() })),
  style: z.object({
    opacity: z.number().optional(),
    radius: z.number().optional(),
    border: z.object({ width: z.number(), color: z.string() }).optional(),
    shadow: z.object({ blur: z.number(), x: z.number(), y: z.number(), color: z.string() }).optional(),
    text: z.object({ fontFamily: z.string(), fontSize: z.number(), fontWeight: z.number(), color: z.string(), align: z.enum(["left","center","right"]) }).optional(),
    fill: FillSchema.optional(),
  }),
  props: z.record(z.string(), z.any()),
});

export const PageModelSchema = z.object({
  id: z.string(),
  title: z.string(),
  rootId: z.string(),
  nodes: z.record(z.string(), ElementNodeSchema),
  background: z.object({
    fill: FillSchema,
    overlay: z.object({ color: z.string(), opacity: z.number() }).optional(),
  })
});
