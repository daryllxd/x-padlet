'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

interface TodoEventsProps {
  todoListId: string;
}

export function TodoEvents({ todoListId }: TodoEventsProps) {
  useEffect(() => {
    console.log('🔍 Client: Connecting to SSE for todo list:', todoListId);
    const eventSource = new EventSource(`/api/todo-lists/${todoListId}/events`);

    eventSource.onopen = () => {
      console.log('🔍 Client: SSE connection opened for todo list:', todoListId);
    };

    eventSource.onmessage = (event) => {
      console.log('🔍 Client: Received SSE message:', event.data);
      const data = JSON.parse(event.data);
      console.log('🔍 Client: Data:', data);

      if (data.type === 'title-updated') {
        console.log('🔍 Client: Showing toast for title update in todo:', data.todoId);
        toast.info(data.message);
      }
    };

    eventSource.onerror = (error) => {
      console.error('🔍 Client: SSE error details:', {
        error,
        readyState: eventSource.readyState,
        url: eventSource.url,
        todoListId,
      });

      // Try to reconnect after a delay
      setTimeout(() => {
        console.log('🔍 Client: Attempting to reconnect SSE...');
        eventSource.close();
        const newEventSource = new EventSource(`/api/todo-lists/${todoListId}/events`);
        newEventSource.onopen = () => console.log('🔍 Client: Reconnected successfully');
        newEventSource.onerror = (e) => console.error('🔍 Client: Reconnection failed:', e);
      }, 5000);
    };

    return () => {
      console.log('🔍 Client: Cleaning up SSE connection for todo list:', todoListId);
      eventSource.close();
    };
  }, [todoListId]);

  return null;
}
