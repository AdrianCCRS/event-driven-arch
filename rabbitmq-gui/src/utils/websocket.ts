interface WebSocketCallbacks {
  onMessage: (message: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

export const connectWebSocket = (url: string, callbacks: WebSocketCallbacks | ((message: string) => void)) => {
    const socket = new WebSocket(url);
    
    // Handle both old function signature and new object signature
    const {onMessage, onOpen, onClose, onError} = typeof callbacks === 'function' 
      ? {onMessage: callbacks, onOpen: undefined, onClose: undefined, onError: undefined}
      : callbacks;

    socket.onopen = (event) => {
        console.log('WebSocket connection established to:', url);
        onOpen?.();
    };

    socket.onmessage = (event) => {
        onMessage(event.data);
    };

    socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        onClose?.();
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        onError?.(error);
    };

    return socket;
};