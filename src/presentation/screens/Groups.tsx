import { ActivityIndicator, Alert, Linking, PermissionsAndroid, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { FlatList, Text } from 'react-native-gesture-handler';
import theme from '../../styles/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import Contacts from 'react-native-contacts/src/NativeContacts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { useCallback, useEffect } from 'react';
import { fetchGroups, resetGroupState } from '../../store/slices/groupSlice';
import showErrorMessage from '../components/ErrorDialog';
import ws from '../../services/WebsocketService';

const GroupScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, success, data } = useSelector((state: RootState) => state.group);

    const handleFetcheGroups = useCallback(async () => {
        try {
            await dispatch(fetchGroups()).unwrap();
        } catch (err) {
            console.log('Fetch groups error:', err);
            if (typeof err === 'string') {
                showErrorMessage(err);
            } else if (err instanceof Error) {
                showErrorMessage(err.message);
            } else {
                showErrorMessage('Groups fetching failed');
            }
        }
    }, [dispatch]);

    useEffect(() => {
        handleFetcheGroups();
    }, [handleFetcheGroups]);

    useEffect(() => {
        if (success) {
            dispatch(resetGroupState());
        }
    }, [success, dispatch]);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={theme.colors.background[700]} barStyle="light-content" />
            <View style={styles.appBar}>
                <Text style={styles.appBarText}>Groups</Text>
            </View>
            {/* <TextInput
                style={styles.input}
                placeholder="Search"
                placeholderTextColor="#ABB5B5"
                // value={details.groupTitle}
                // onChangeText={(text) => setDetails({ ...details, groupTitle: text })}
            /> */}
            {loading ? (
                <ActivityIndicator
                    size="large"
                    color={theme.colors.primary[500]}
                    style={styles.loadingIndicator}
                />
            ) :
            <FlatList
                data={data}
                keyExtractor={(item, index) => item.id || index.toString()}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                    return (
                        <Pressable onPress={() => {
                            ws.joinGroup(Number(item.id));
                            navigation.navigate('Chat', {groupId: item.id});
                        }}
                        style={styles.card}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{item.name?.charAt(0).toUpperCase()}</Text>
                            </View>
                            <Text style={styles.nameText}>{item.name}</Text>
                        </Pressable>
                    );
                }}
            />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background[700],
        flex: 1,
    },
    appBar: {
        padding: 10,
        backgroundColor: theme.colors.background[700],
        elevation: 10,
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
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        // paddingHorizontal: 12,
    },
    card: {
        padding: 15,
        marginVertical: 2,
        borderBottomWidth: 0.5,
        borderRadius: 10,
        borderColor: theme.colors.secondary[900],
        // backgroundColor: theme.colors.background[700],
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 20,
        backgroundColor: theme.colors.primary[500],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    nameText: {
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default GroupScreen;
