import { useWindowSize } from 'react-use';

/**
 * @description Returns true if the window width is less than 768px
 * @todo: Use a real hook or a more sophisticated way to detect mobile, this is just a quick fix
 */
export function useIsMobile() {
  const { width } = useWindowSize();
  const X_PADLET_MOBILE_WIDTH = 768;
  return { isMobile: width < X_PADLET_MOBILE_WIDTH, width };
}
