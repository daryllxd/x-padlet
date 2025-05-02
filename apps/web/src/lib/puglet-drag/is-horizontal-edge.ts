import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types';

export function isHorizontalEdge(edge: Edge): edge is 'left' | 'right' {
  return edge === 'left' || edge === 'right';
}
