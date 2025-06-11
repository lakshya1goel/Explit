import { ActivityIndicator, Alert, Linking, PermissionsAndroid, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { FlatList, Text } from 'react-native-gesture-handler';
import theme from '../../styles/theme';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import Contacts from 'react-native-contacts/src/NativeContacts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { useCallback, useEffect } from 'react';
import { fetchGroups, resetGroupState } from '../../store/slices/groupSlice';
import showErrorMessage from '../components/ErrorDialog';
import ws from '../../services/WebsocketService';
import { FloatingAction } from 'react-native-floating-action';

const HomeScreen = () => {
    const actions = [
        {
            text: 'Create Group',
            icon: require('../../../assets/icons/create_group.png'),
            name: 'bt_group',
            position: 2,
            color: theme.colors.primary[500],
            textBackground: 'transparent',
            textColor: '#fff',
        },
        {
            text: 'Create Expense',
            icon: require('../../../assets/icons/create_expense.png'),
            name: 'bt_expense',
            position: 1,
            color: theme.colors.primary[500],
            textBackground: 'transparent',
            textColor: '#fff',
        },
    ];
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, success, data } = useSelector((state: RootState) => state.group);

    const handleFetcheGroups = useCallback(async () => {
        try {
          await dispatch(fetchGroups()).unwrap();
        } catch (err) {
          console.log('Fetch groups error:', err);
          if (typeof err === 'string') {
            console.log('Error fetching groups:', err);
          } else if (err instanceof Error) {
            showErrorMessage(err.message);
          } else {
            showErrorMessage('Groups fetching failed');
          }
        }
    }, [dispatch]);

    useFocusEffect(
        useCallback(() => {
            handleFetcheGroups();
        }, [handleFetcheGroups])
    );

    useEffect(() => {
        if (success) {
            dispatch(resetGroupState());
        }
    }, [success, dispatch]);

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
                <Text style={styles.appBarText}>Explit</Text>
            </View>
            <View style={styles.monthlyExpense}>
                <Text style={styles.monthlyExpenseHeading}>Monthy Analysis</Text>
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryBox}>
                        <Text style={styles.owedByAmount}>₹{100}</Text>
                        <Text style={styles.subText}>Owed by you</Text>
                    </View>
                    <View style={styles.summaryBox}>
                        <Text style={styles.owedToAmount}>₹{700}</Text>
                        <Text style={styles.subText}>Owed to you</Text>
                    </View>
                </View>
                <Text style={styles.personalExpense}>Personal Expenses: ₹{100}</Text>

            </View>
            <View style={styles.expenses}>
                <View style={styles.expense}>
                    <Text style={styles.personalExpense}>Weekly Personal Expenses</Text>
                    <Text style={styles.personalExpense}>₹{100}</Text>
                </View>
                <View style={styles.expense}>
                    <Text style={styles.personalExpense}>Daily Personal Expenses</Text>
                    <Text style={styles.personalExpense}>₹{700}</Text>
                </View>
            </View>
            <Pressable style={styles.viewPersonalExpense}>
                <Text style={styles.personalExpenseButtonText}>View Personal Expenses</Text>
                <Text style={styles.personalExpenseButtonText}>{'>'}</Text>
            </Pressable>
            <Text style={styles.heading}>Groups</Text>
            {loading ? (
                <ActivityIndicator
                    size="large"
                    color={theme.colors.primary[500]}
                    style={styles.loadingIndicator}
                />
            ) : (
                data.length === 0 ? (
                    <View style={styles.loadingIndicator}>
                        <Text style={{ color: '#fff' }}>No groups found</Text>
                    </View>
                ) :
                <FlatList
                    data={(data.length > 11) ? [...data.slice(0, 11), { id: 'more', name: 'More' }] : data}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    numColumns={4}
                    renderItem={({ item }) => {
                        if (item.id === 'more') {
                            return (
                                <Pressable
                                    onPress={() => {
                                        navigation.navigate('Group');
                                    }}
                                    style={styles.card}>
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>→</Text>
                                    </View>
                                    <Text style={styles.nameText}>More</Text>
                                </Pressable>
                            );
                        }
                        return (
                            <Pressable
                                onPress={() => {
                                    ws.joinGroup(Number(item.id));
                                    navigation.navigate('Chat', { groupId: item.id });
                                }}
                                style={styles.card}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{item.name?.charAt(0).toUpperCase()}</Text>
                                </View>
                                <Text style={styles.nameText}>
                                    {item.name.length > 20
                                        ? item.name.slice(0, 7) + '...'
                                        : item.name}
                                </Text>
                            </Pressable>
                        );
                    }}
                />
            )}
            <FloatingAction
                overlayColor="rgba(0, 0, 0, 0.8)"
                color={theme.colors.primary[500]}
                distanceToEdge={20}
                actions={actions}
                onPressItem={
                    name => {
                        console.log(`selected button: ${name}`);
                        if (name === 'bt_group') {
                            requestContactPermission();
                        } else if (name === 'bt_expense') {
                        }
                    }
                }
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
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    monthlyExpense: {
        height: 125,
        backgroundColor: theme.colors.secondary[900],
        borderRadius: 20,
        margin: 10,
        marginBottom: 10,
    },
    monthlyExpenseHeading: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10,
    },
    personalExpense: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
    expenses : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    expense : {
        width: '48%',
        height: 85,
        backgroundColor: theme.colors.secondary[900],
        borderRadius: 20,
        marginBottom: 10,
        justifyContent: 'center',
    },
    viewPersonalExpense: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopColor: theme.colors.primary[300],
        borderBottomColor: theme.colors.primary[300],
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        marginBottom: 10,

    },
    personalExpenseButtonText: {
        color: theme.colors.primary[500],
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginHorizontal: 15,
        marginVertical: 10,
    },
    heading: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    card: {
        padding: 20,
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 20,
        backgroundColor: theme.colors.primary[800],
        justifyContent: 'center',
        alignItems: 'center',
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
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryBox: {
        flex: 1,
        alignItems: 'center',
    },
    owedByAmount: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    owedToAmount: {
        color: theme.colors.success[500],
        fontSize: 20,
        fontWeight: 'bold',
    },
    subText: {
        color: '#fff',
        fontSize: 13,
        marginTop: 4,
    },
});

export default HomeScreen;
