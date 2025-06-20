import React, { useCallback, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Pressable, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import theme from '../../styles/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import showErrorMessage from '../components/ErrorDialog';
import { getPersonalExpense, resetPersonalExpenseState } from '../../store/slices/personalExpenseSlice';

const PersonalExpenseScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, success, data } = useSelector((state: RootState) => state.personalExpense);

    const handleFetchPesonalExpenses = useCallback(async () => {
        try {
            await dispatch(getPersonalExpense()).unwrap();
        } catch (err) {
            console.log('Fetch personal expenses error:', err);
            if (typeof err === 'string') {
                showErrorMessage(err);
            } else if (err instanceof Error) {
                showErrorMessage(err.message);
            } else {
                showErrorMessage('Personal Expenses fetching failed');
            }
        }
    }, [dispatch]);

    useEffect(() => {
        handleFetchPesonalExpenses();
    }, [handleFetchPesonalExpenses]);

    useEffect(() => {
        if (success) {
            dispatch(resetPersonalExpenseState());
        }
    }, [success, dispatch]);

    return (
        <View style={styles.container}>
            <View style={styles.appBar}>
                <Text style={styles.appBarText}>Your Expenses</Text>
            </View>
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
                        <View style={styles.card}>
                            <View>
                                <Text style={styles.nameText}>{item.title}</Text>
                                <Text style={styles.descText}>{item.description}</Text>
                            </View>
                            <View>
                                <Text style={styles.descText}>
                                    {item.CreatedAt ? new Date(item.CreatedAt).toLocaleDateString() : ''}
                                </Text>
                                <Text style={styles.amtText}>₹{item.amount}</Text>
                            </View>
                        </View>
                    );
                }}
            />}
            <View style={styles.buttonBar}>
                <TouchableOpacity style={styles.actionButton} onPress={() => {navigation.navigate('CreatePersonalExpense')}}>
                    <Text style={styles.buttonText}>Add Expense</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

    const styles = StyleSheet.create({
    container: {
        flex: 1 ,
        backgroundColor: theme.colors.background[700],
        paddingBottom: 70,
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
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.background[100],
        borderRadius: 10,
        marginBottom: 10,
        padding: 15,
    },
    nameText: {
        color: '#fff',
        fontSize: 16,
    },
    descText: {
        color: theme.colors.secondary[300],
    },
    amtText: {
        color: theme.colors.primary[500],
        textAlign: 'right',
    },
    buttonBar: {
        padding: 20,
        borderTopWidth: 0.5,
        borderTopColor: '#333',
        backgroundColor: '#000',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    actionButton: {
        backgroundColor: theme.colors.primary[500],
        width: '100%',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
    },
});

export default PersonalExpenseScreen;
