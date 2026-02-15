// Breakpoints and responsive rules
export const BREAKPOINTS = ["desktop", "tablet", "mobile"] as const;
export type Breakpoint = typeof BREAKPOINTS[number];

export function getCurrentBreakpoint(width: number): Breakpoint {
  if (width < 700) return "mobile";
  if (width < 1100) return "tablet";
  return "desktop";
}
