"use client";
import { BLOCKS } from "@/components/blocks";


export default function BlocksRenderer({ layout }: { layout: any[] }) {
  return (
    <div>
      {layout.map((block, idx) => {
        const Block = BLOCKS[block.type as keyof typeof BLOCKS];
        if (!Block) return <div key={idx}>Unknown block: {block.type}</div>;
        return <Block key={idx} {...block.props} />;
      })}
    </div>
  );
}