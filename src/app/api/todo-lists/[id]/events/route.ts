import { todoEvents } from '@/lib/events';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  console.log('🔍 SSE: New connection request for todo list');
  const { id } = await params;

  console.log('🔍 SSE: Connected for todo list ID:', id);

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  const sendEvent = (data: any) => {
    console.log('🔍 SSE: Sending event:', data);
    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  };

  const listener = (data: any) => {
    console.log('🔍 SSE: Received event to broadcast:', data);
    sendEvent(data);
  };

  console.log('🔍 SSE: Subscribing to events for todo list:', id);
  todoEvents.subscribe(id, listener);

  // Clean up on connection close
  request.signal.addEventListener('abort', () => {
    console.log('🔍 SSE: Connection closed for todo list:', id);
    todoEvents.unsubscribe(id, listener);
  });

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
