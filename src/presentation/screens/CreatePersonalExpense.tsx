import { ActivityIndicator, Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, TextInput } from 'react-native-gesture-handler';
import theme from '../../styles/theme';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import React, { useEffect } from 'react';
import showSuccessMessage from '../components/SuccessDialog';
import showErrorMessage from '../components/ErrorDialog';
import { createPersonalExpense, resetPersonalExpenseState } from '../../store/slices/personalExpenseSlice';
import { PersonalExpenseCreationPayload } from '../../store/types/personalExpense';

const CreatePersonalExpenseScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useDispatch<AppDispatch>();

    const [details, setDetails] = React.useState({
        amount: '',
        title: '',
        desc: '',
    });

    const { loading, success } = useSelector((state: RootState) => state.personalExpense);

    useEffect(() => {
        if (success) {
            showSuccessMessage('Expense created successfully');
            setTimeout(() => navigation.goBack(), 500);
        }
        return () => {
            dispatch(resetPersonalExpenseState());
        };
    }, [success, navigation, dispatch]);

    const handleCreatePersonalExpense = async () => {
        try {
            if (!details.title.trim() || details.amount.trim() === '') {
                showErrorMessage('Expense title is required');
                return;
            }
            if (!details.amount.trim() || isNaN(parseFloat(details.amount.trim())) || parseFloat(details.amount.trim()) <= 0) {
                showErrorMessage('Amount must be a valid positive number');
                return;
            }
            const payload: PersonalExpenseCreationPayload = {
                amount: parseFloat(details.amount.trim()),
                title: details.title.trim(),
                description: details.desc.trim(),
            };
            await dispatch(createPersonalExpense(payload)).unwrap();
        } catch (err) {
            console.log('Create personal expense error:', err);
            if (typeof err === 'string') {
                showErrorMessage(err);
            } else if (err instanceof Error) {
                showErrorMessage(err.message);
            } else {
                showErrorMessage('Group creation failed');
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.appBar}>
                <Text style={styles.appBarText}>Add Your Expense</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Title"
                placeholderTextColor="#ABB5B5"
                value={details.title}
                onChangeText={(text) => setDetails({ ...details, title: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                placeholderTextColor="#ABB5B5"
                value={details.desc}
                onChangeText={(text) => setDetails({ ...details, desc: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Amount"
                placeholderTextColor="#ABB5B5"
                keyboardType="numeric"
                value={details.amount}
                onChangeText={(text) => setDetails({ ...details, amount: text })}
            />
            <View style={styles.buttonBar}>
            {loading ? (
                <ActivityIndicator
                    size="large"
                    color={theme.colors.primary[500]}
                    style={styles.loadingIndicator}
                />
            ) : <TouchableOpacity style={styles.actionButton} onPress={() => {
                    handleCreatePersonalExpense();
                    setDetails({
                        amount: '',
                        title: '',
                        desc: '',
                    });
                    Keyboard.dismiss();
                }}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>}
            </View>
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
    input: {
        backgroundColor: theme.colors.secondary[900],
        height: 60,
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 15,
        borderRadius: 6,
        color: '#fff',
    },
    buttonBar: {
        padding: 10,
        borderTopWidth: 0.5,
        borderTopColor: '#333',
        backgroundColor: '#000',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    actionButton: {
        backgroundColor: theme.colors.primary[500],
        width: '100%',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginRight: 5,
    },
    buttonText: {
        color: 'white',
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CreatePersonalExpenseScreen;
