import {PermissionsAndroid, TouchableOpacity, View, Alert, Linking} from 'react-native';
import Contacts from 'react-native-contacts/src/NativeContacts';
import { Text } from 'react-native-gesture-handler';

const requestContactPermission = async () => {
    try {
        const granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS
        );

        if (granted) {
            console.log('Already granted, fetching contacts...');
            const contacts = await Contacts!.getAll();
            console.log('Contacts:', contacts.length);
            console.log('Contacts:', contacts);
            return;
        }

        const res = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
                title: 'Contacts Permission',
                message: 'This app needs access to your contacts.',
                buttonPositive: 'OK',
                buttonNegative: 'Cancel',
            }
        );

        console.log('Permission result:', res);

        if (res === PermissionsAndroid.RESULTS.GRANTED) {
            const contacts = await Contacts!.getAll();
            console.log('Contacts fetched:', contacts.length);
            console.log('Contacts:', contacts);
        } else if (res === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            Alert.alert(
                'Permission Required',
                'You have blocked contact access. Please enable it from Settings.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Open Settings',
                        onPress: () => Linking.openSettings(),
                    },
                ]
            );
        } else {
            console.log('Permission denied');
        }
    } catch (error) {
        console.error('Permission error:', error);
    }
};

const HomeScreen = () => {
    return (
        <View>
            <TouchableOpacity style={{alignItems: 'center', padding: 20, marginTop: 50, backgroundColor: '#ddd'}} onPress={requestContactPermission}>
                <Text>Get Contacts</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HomeScreen;
