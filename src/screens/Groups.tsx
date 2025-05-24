import { Alert, Linking, PermissionsAndroid, Pressable, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FlatList, Text, TextInput } from 'react-native-gesture-handler';
import theme from '../styles/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import Contacts from 'react-native-contacts/src/NativeContacts';

const GroupScreen = () => {
    const groupdata = [
        {
            id: '1',
            name: 'Family',
            members: ['John Doe', 'Jane Doe'],
        },
        {
            id: '2',
            name: 'Friends',
            members: ['Alice', 'Bob'],
        },
        {
            id: '3',
            name: 'Work',
            members: ['Charlie', 'Dave'],
        },
    ];

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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
                navigation.navigate('Contact', { contacts: contacts });
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
                navigation.navigate('Contact', { contacts: contacts });
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

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={theme.colors.background[950]} barStyle="light-content" />
            <View style={styles.appBar}>
                <Text style={styles.appBarText}>Groups</Text>
                <TouchableOpacity style={styles.button} onPress={requestContactPermission}>
                    <Text>Create Group</Text>
                </TouchableOpacity>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Search"
                placeholderTextColor="#ABB5B5"
                // value={details.groupTitle}
                // onChangeText={(text) => setDetails({ ...details, groupTitle: text })}
            />
            <FlatList
                data={groupdata}
                keyExtractor={(item, index) => item.id || index.toString()}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                    return (
                        <Pressable onPress={() => {navigation.navigate('Chat');}} style={styles.card}>
                            <Text style={styles.nameText}>{item.name}</Text>
                        </Pressable>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background[950],
        flex: 1,
    },
    appBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: theme.colors.background[950],
        elevation: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.colors.secondary[300],
    },
    appBarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: theme.colors.primary[500],
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },
    input: {
        backgroundColor: theme.colors.secondary[900],
        padding: 15,
        marginVertical: 5,
        marginHorizontal: 5,
        borderRadius: 20,
        color: '#fff',
    },
    listContent: {
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    card: {
        padding: 20,
        marginVertical: 8,
        borderRadius: 10,
        backgroundColor: theme.colors.background[700],
    },
    nameText: {
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default GroupScreen;
