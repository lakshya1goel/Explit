import { ActivityIndicator, Alert, Image, Linking, PermissionsAndroid, Pressable, StatusBar, StyleSheet, useWindowDimensions, View } from 'react-native';
import { FlatList, Text } from 'react-native-gesture-handler';
import theme from '../../styles/theme';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import Contacts from 'react-native-contacts/src/NativeContacts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { useCallback, useEffect, useState } from 'react';
import { fetchGroups, resetGroupState } from '../../store/slices/groupSlice';
import showErrorMessage from '../components/ErrorDialog';
import ws from '../../services/WebsocketService';
import { FloatingAction } from 'react-native-floating-action';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { getDailyExpense, getMonthlyExpense, getWeeklyExpense, resetAnalysisState } from '../../store/slices/analysisSlice';
import { GetDailyAnalysisRequest, GetMonthlyAnalysisRequest, GetWeeklyAnalysisRequest } from '../../store/types/analysis';

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
    const {analysisLoading, analysisSuccess, monthly_analysis, weekly_analysis, daily_analysis} = useSelector((state: RootState) => state.analysis);

    const handleFetchMonthlyAnalysis = useCallback(async () => {
        try {
            const request: GetMonthlyAnalysisRequest = {
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
            };
            await dispatch(getMonthlyExpense(request)).unwrap();
        } catch (err) {
            console.log('Fetch monthly expense error:', err);
            if (typeof err === 'string') {
                showErrorMessage(err);
            } else if (err instanceof Error) {
                showErrorMessage(err.message);
            } else {
                showErrorMessage('monthly expense fetching failed');
            }
        }
    }, [dispatch]);

    useEffect(() => {
        handleFetchMonthlyAnalysis();
    }, [handleFetchMonthlyAnalysis]);

    useEffect(() => {
        if (analysisSuccess) {
            dispatch(resetAnalysisState());
        }
    }, [analysisSuccess, dispatch]);

    const handleFetchWeeklyAnalysis = useCallback(async () => {
        try {
            const today = new Date();
            const dayOfWeek = today.getDay();
            const diffToMonday = (dayOfWeek === 1) ? 0 : (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
            const lastMonday = new Date(today);
            lastMonday.setDate(today.getDate() - diffToMonday);

            const request: GetWeeklyAnalysisRequest = {
                week: lastMonday.getDate(),
                month: lastMonday.getMonth() + 1,
                year: lastMonday.getFullYear(),
            };
            await dispatch(getWeeklyExpense(request)).unwrap();
        } catch (err) {
            console.log('Fetch weekly expense error:', err);
            if (typeof err === 'string') {
                showErrorMessage(err);
            } else if (err instanceof Error) {
                showErrorMessage(err.message);
            } else {
                showErrorMessage('weekly expense fetching failed');
            }
        }
    }, [dispatch]);

    useEffect(() => {
        handleFetchWeeklyAnalysis();
    }, [handleFetchWeeklyAnalysis]);

    const handleFetchDailyAnalysis = useCallback(async () => {
        try {
            const request: GetDailyAnalysisRequest = {
                day: new Date().getDate(),
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
            };
            await dispatch(getDailyExpense(request)).unwrap();
        } catch (err) {
            console.log('Fetch daily expense error:', err);
            if (typeof err === 'string') {
                showErrorMessage(err);
            } else if (err instanceof Error) {
                showErrorMessage(err.message);
            } else {
                showErrorMessage('daily expense fetching failed');
            }
        }
    }, [dispatch]);

    useEffect(() => {
        handleFetchDailyAnalysis();
    }, [handleFetchDailyAnalysis]);

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

    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'monthly', title: 'Monthly' },
        { key: 'weekly', title: 'Weekly' },
        { key: 'daily', title: 'Daily' },
    ]);

    const MonthlyRoute = () => (
        <View>
            <View style={styles.analysisFooter}>
                <View>
                    <Text style={styles.amtTextStyle}>Owed by you</Text>
                    <Text style={styles.amtTextStyle}>Owed to you</Text>
                    <Text style={styles.amtTextStyle}>Personal expense</Text>
                </View>
                <View style={styles.amtStyle}>
                    <Text style={styles.amtTextStyle}>₹{monthly_analysis?.owed_by_amount}</Text>
                    <Text style={styles.amtTextStyle}>₹{monthly_analysis?.owed_to_amount}</Text>
                    <Text style={styles.amtTextStyle}>₹{monthly_analysis?.spent_amount}</Text>
                </View>
                <Image source={require('../../../assets/images/analysis.png')} style={styles.img} />
            </View>
        </View>
    );

    const WeeklyRoute = () => (
        <View>
            <View style={styles.analysisFooter}>
                <View>
                    <Text style={styles.amtTextStyle}>Owed by you</Text>
                    <Text style={styles.amtTextStyle}>Owed to you</Text>
                    <Text style={styles.amtTextStyle}>Personal expense</Text>
                </View>
                <View style={styles.amtStyle}>
                    <Text style={styles.amtTextStyle}>₹{weekly_analysis?.owed_by_amount}</Text>
                    <Text style={styles.amtTextStyle}>₹{weekly_analysis?.owed_to_amount}</Text>
                    <Text style={styles.amtTextStyle}>₹{weekly_analysis?.spent_amount}</Text>
                </View>
                <Image source={require('../../../assets/images/analysis.png')} style={styles.img} />
            </View>
        </View>
    );

    const DailyRoute = () => (
        <View>
            <View style={styles.analysisFooter}>
                <View>
                    <Text style={styles.amtTextStyle}>Owed by you</Text>
                    <Text style={styles.amtTextStyle}>Owed to you</Text>
                    <Text style={styles.amtTextStyle}>Personal expense</Text>
                </View>
                <View style={styles.amtStyle}>
                    <Text style={styles.amtTextStyle}>₹{daily_analysis?.owed_by_amount}</Text>
                    <Text style={styles.amtTextStyle}>₹{daily_analysis?.owed_to_amount}</Text>
                    <Text style={styles.amtTextStyle}>₹{daily_analysis?.spent_amount}</Text>
                </View>
                <Image source={require('../../../assets/images/analysis.png')} style={styles.img} />
            </View>
        </View>
    );

    const renderScene = SceneMap({
        monthly: MonthlyRoute,
        weekly: WeeklyRoute,
        daily: DailyRoute,
    });

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={theme.colors.background[700]} barStyle="light-content" />
            <View style={styles.appBar}>
                <Text style={styles.appBarText}>Explit</Text>
            </View>
            <View style={styles.monthlyExpense}>
                <Text style={styles.monthlyExpenseHeading}>Analysis</Text>
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={props => (
                        <TabBar
                            {...props}
                            indicatorStyle={styles.indicator}
                            style={styles.analysisTypeText}
                            tabStyle={styles.tabStyle}
                        />
                    )}
                />
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
                                        <Text style={styles.avatarText}>{'>'}</Text>
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
    monthlyExpense: {
        height: 200,
        backgroundColor: theme.colors.background[100],
        borderRadius: 20,
        margin: 10,
        marginBottom: 10,
    },
    monthlyExpenseHeading: {
        color: '#fff',
        fontSize: 20,
        margin: 10,
        paddingHorizontal: 10,
    },
    indicator: {
        backgroundColor: theme.colors.background[100],
    },
    analysisTypeText: {
        color: '#fff',
        backgroundColor: theme.colors.background[100],
        textAlign: 'center',
        textAlignVertical: 'center',
        marginHorizontal: 5,
    },
    tabStyle: {
        backgroundColor: theme.colors.primary[500],
        borderRadius: 20,
        width: 100,
        marginHorizontal: 5,
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
        textAlign: 'center',
    },
    nameText: {
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default HomeScreen;
