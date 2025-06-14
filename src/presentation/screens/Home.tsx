import { ActivityIndicator, Alert, Image, Linking, PermissionsAndroid, Pressable, StatusBar, StyleSheet, View } from 'react-native';
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
            <StatusBar backgroundColor={theme.colors.background[700]} barStyle="light-content" />
            <View style={styles.appBar}>
                <Text style={styles.appBarText}>Explit</Text>
            </View>
            <View style={styles.monthlyExpense}>
                <View style={styles.analysisHeader}>
                    <Text style={styles.monthlyExpenseHeading}>Analysis</Text>
                    <View style={styles.analysisTypeConatiner}>
                        <Text style={styles.analysisTypeText}>Monthly</Text>
                        <Text style={styles.analysisTypeText}>Weekly</Text>
                        <Text style={styles.analysisTypeText}>Daily</Text>
                    </View>
                </View>
                <View style={styles.analysisFooter}>
                    <View>
                        <Text style={styles.amtTextStyle}>Owed by you</Text>
                        <Text style={styles.amtTextStyle}>Owed to you</Text>
                        <Text style={styles.amtTextStyle}>Personal expense</Text>
                    </View>
                    <View style={styles.amtStyle}>
                        <Text style={styles.amtTextStyle}>₹100</Text>
                        <Text style={styles.amtTextStyle}>₹500</Text>
                        <Text style={styles.amtTextStyle}>₹10000</Text>
                    </View>
                    <Image source={require('../../../assets/images/analysis.png')} style={styles.img}/>
                </View>
            </View>
            <Pressable style={styles.viewPersonalExpense} onPress={() => {
                navigation.navigate('PersonalExpense');
            }}>
                <Text style={styles.personalExpenseButtonText}>Personal Expenses</Text>
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
                            navigation.navigate('CreatePersonalExpense');
                        }
                    }
                }
            />
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
    analysisHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    monthlyExpense: {
        height: 150,
        backgroundColor: theme.colors.background[100],
        borderRadius: 20,
        margin: 10,
        marginBottom: 10,
    },
    monthlyExpenseHeading: {
        color: '#fff',
        fontSize: 20,
        margin: 10,
    },
    analysisTypeConatiner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        paddingVertical: 10,
    },
    analysisTypeText: {
        color: '#fff',
        fontSize: 12,
        paddingVertical: 4,
        marginHorizontal: 5,
        width: 60,
        borderRadius: 10,
        backgroundColor: theme.colors.primary[500],
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    analysisFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    amtStyle: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginLeft: 10,
    },
    amtTextStyle: {
        color: '#fff',
        fontSize: 16,
    },
    img: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginLeft: 10,
    },
    viewPersonalExpense: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.background[100],
        borderRadius: 20,
        margin: 10,
        padding: 10,
    },
    personalExpenseButtonText: {
        color: '#fff',
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
        marginHorizontal: 20,
    },
    card: {
        padding: 20,
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 20,
        backgroundColor: theme.colors.primary[600],
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
});

export default HomeScreen;
