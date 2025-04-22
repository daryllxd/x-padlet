type Listener = (data: any) => void;

class EventEmitter {
  private listeners: Map<string, Set<Listener>> = new Map();

  subscribe(todoId: string, listener: Listener) {
    console.log('🔍 Emitter: Subscribing listener for todo:', todoId);
    if (!this.listeners.has(todoId)) {
      console.log('🔍 Emitter: Creating new listener set for todo:', todoId);
      this.listeners.set(todoId, new Set());
    }
    this.listeners.get(todoId)!.add(listener);
    console.log('🔍 Emitter: Total listeners for todo:', todoId, this.listeners.get(todoId)?.size);
  }

  unsubscribe(todoId: string, listener: Listener) {
    console.log('🔍 Emitter: Unsubscribing listener for todo:', todoId);
    this.listeners.get(todoId)?.delete(listener);
    console.log(
      '🔍 Emitter: Remaining listeners for todo:',
      todoId,
      this.listeners.get(todoId)?.size
    );
  }

  emit(todoId: string, data: any) {
    console.log('🔍 Emitter: Emitting event for todo:', todoId, data);
    const listeners = this.listeners.get(todoId);
    if (listeners) {
      console.log('🔍 Emitter: Broadcasting to', listeners.size, 'listeners');
      listeners.forEach((listener) => listener(data));
    } else {
      console.log('🔍 Emitter: No listeners found for todo:', todoId);
    }
  }
}

export const todoEvents = new EventEmitter();
