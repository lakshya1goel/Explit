import AuthService from './AuthService';

class WebSocketService {
    private socket: WebSocket | null = null;

    connect = async (url: string) => {
      if (this.socket) {
        return;
      }

      const tokens = await AuthService.getToken();
      const token = tokens?.accessToken || '';

      this.socket = new WebSocket(url, null, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
      });

      this.socket.onopen = () => {
        console.log('WebSocket connected');
      };

      this.socket.onmessage = (event) => {
        console.log('Received message:', event.data);
        // You can route messages to a listener
      };

      this.socket.onerror = (error) => {
        console.log('WebSocket error', error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.socket = null;
      };
    };

    joinGroup = (groupId: number) => {
        if (this.socket?.readyState === WebSocket.OPEN) {
          const message = JSON.stringify({
            type: 'join-group',
            body: 'Joining group',
            group_id: groupId,
          });
          this.socket.send(message);
        } else {
          console.log('WebSocket not open. Cannot join group.');
        }
    };

    sendMessage = (groupId: number, content: string) => {
        if (this.socket?.readyState === WebSocket.OPEN) {
          const message = JSON.stringify({
            type: 'message',
            body: content,
            group_id: groupId,
          });
          this.socket.send(message);
        } else {
          console.log('WebSocket not open. Cannot send message.');
        }
    };

    disconnect = () => {
      this.socket?.close();
    };
}

const ws = new WebSocketService();
export default ws;
