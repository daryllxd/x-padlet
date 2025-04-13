import { useWindowSize } from 'react-use';

const X_PADLET_MOBILE_WIDTH = 768;

/**
 * @description Returns true if the window width is less than 768px
 * @todo: Use a real hook or a more sophisticated way to detect mobile, this is just a quick fix
 */
export function useIsMobile() {
  const { width } = useWindowSize();
  return { isMobile: width < X_PADLET_MOBILE_WIDTH, width };
}
