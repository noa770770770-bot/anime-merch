// Snap lines and guides for drag/resize
export type SnapResult = { x: number; y: number; guides: { x?: number; y?: number } };

export function snapRect(
  rect: { x: number; y: number; w: number; h: number },
  others: Array<{ x: number; y: number; w: number; h: number }>,
  threshold = 6
): SnapResult {
  let sx = rect.x, sy = rect.y;
  let gx: number | undefined, gy: number | undefined;
  const rectEdgesX = [rect.x, rect.x + rect.w / 2, rect.x + rect.w];
  const rectEdgesY = [rect.y, rect.y + rect.h / 2, rect.y + rect.h];
  for (const o of others) {
    const oEdgesX = [o.x, o.x + o.w / 2, o.x + o.w];
    const oEdgesY = [o.y, o.y + o.h / 2, o.y + o.h];
    for (let i = 0; i < rectEdgesX.length; i++) {
      for (const ex of oEdgesX) {
        const dx = ex - rectEdgesX[i];
        if (Math.abs(dx) <= threshold) {
          sx += dx;
          gx = ex;
        }
      }
    }
    for (let i = 0; i < rectEdgesY.length; i++) {
      for (const ey of oEdgesY) {
        const dy = ey - rectEdgesY[i];
        if (Math.abs(dy) <= threshold) {
          sy += dy;
          gy = ey;
        }
      }
    }
  }
  return { x: sx, y: sy, guides: { x: gx, y: gy } };
}
