/**
 * Z-index system for the application
 *
 * Usage:
 * 1. Import the zIndex object
 * 2. Use the predefined layers
 * 3. Add new layers as needed
 *
 * Example:
 * ```tsx
 * import { zIndex } from '@/lib/z-index';
 *
 * <div style={{ zIndex: zIndex.tooltip }} />
 * ```
 */
export const zIndex = {
  // Base layers
  base: 0,
  content: 1,

  // Interactive elements
  button: 10,
  dropdown: 20,
  tooltip: 30,

  // Overlays
  modal: 100,
  dialog: 100,
  dialogTooltip: 130,
  popover: 90,

  header: 100,

  // Notifications
  toast: 1000,
} as const;

/**
 * Helper function to get a z-index value
 * @param key The z-index key to get
 * @returns The z-index value
 */
export function getZIndex(key: keyof typeof zIndex): number {
  return zIndex[key];
}
