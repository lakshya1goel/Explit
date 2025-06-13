import 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { useEffect } from 'react';
import ws from './src/services/WebsocketService';
import { WEBSOCKET_URL } from '@env';

const App = () => {
  useEffect(() => {
    console.log('Connecting to WebSocket at:', WEBSOCKET_URL);
    ws.connect(WEBSOCKET_URL);

    return () => {
      ws.disconnect();
    };
  }, []);
  return <AppNavigator />;
};

export default App;
