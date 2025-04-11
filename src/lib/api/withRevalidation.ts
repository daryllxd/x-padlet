import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

type RouteHandler<T> = (
  request: NextRequest,
  params: { params: Promise<T> }
) => Promise<NextResponse>;

export function withRevalidation<T>(tag: Parameters<typeof revalidateTag>[0]) {
  return function (handler: RouteHandler<T>) {
    return async function (request: NextRequest, params: { params: Promise<T> }) {
      const response = await handler(request, params);

      // Only revalidate if the response is successful
      if (response.ok) {
        revalidateTag(tag);
      }

      return response;
    };
  };
}
