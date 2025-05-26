import AuthService from './AuthService';

class WebSocketService {
    private socket: WebSocket | null = null;
    private currentGroupId: number | null = null;
    private messageListener: ((message: any) => void) | null = null;

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
        if (this.currentGroupId !== null) {
            this.joinGroup(this.currentGroupId);
        }
      };

      this.socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log('Received message:', data);
            if (
              data?.type === 'message' &&
              data?.group_id === this.currentGroupId &&
              this.messageListener
            ) {
              this.messageListener(data);
            }
        } catch (e) {
            console.error('Invalid JSON message', e);
        }
      };

      this.socket.onerror = (error) => {
        console.log('WebSocket error', error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.socket = null;
        this.messageListener = null;
        this.currentGroupId = null;
      };
    };

    joinGroup = (groupId: number) => {
        this.currentGroupId = groupId;
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

    sendMessage = (content: string) => {
        if (this.socket?.readyState === WebSocket.OPEN) {
          const message = JSON.stringify({
            type: 'message',
            body: content,
            group_id: this.currentGroupId,
          });
          this.socket.send(message);
        } else {
          console.log('WebSocket not open. Cannot send message.');
        }
    };

    leaveGroup = () => {
        if (this.socket?.readyState === WebSocket.OPEN) {
          if (this.currentGroupId === null) {
            console.log('No group joined.');
            return;
          }
          const message = JSON.stringify({
            type: 'leave-group',
            body: 'Leaving group',
            group_id: this.currentGroupId,
          });
          this.socket.send(message);
          console.log(`Leaving group ${this.currentGroupId}`);
          this.currentGroupId = null;
        } else {
          console.log('WebSocket not open. Cannot leave group.');
        }
    };

    setMessageListener = (listener: ((message: any) => void) | null) => {
        this.messageListener = listener;
    };

    disconnect = () => {
      this.socket?.close();
    };
}

const ws = new WebSocketService();
export default ws;
