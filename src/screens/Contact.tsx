import { RouteProp, useRoute } from '@react-navigation/native';
import { View } from 'react-native';
import { FlatList, Text } from 'react-native-gesture-handler';
import { RootStackParamList } from '../types';

const ContactScreen = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'Contact'>>();
    const {contacts} = route.params;

    return (
        <FlatList
        data={contacts}
        keyExtractor={(item, index) => item.recordID?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 20, borderBottomWidth: 1, borderColor: '#ccc' }}>
            <Text>{item.displayName || 'No Name'}</Text>
            <Text>{item.phoneNumbers?.[0]?.number || 'No Phone Number'}</Text>
          </View>
        )}
      />
    );
};

export default ContactScreen;
