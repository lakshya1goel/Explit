import { ActivityIndicator, Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, TextInput } from 'react-native-gesture-handler';
import theme from '../../styles/theme';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import React, { useEffect } from 'react';
import showSuccessMessage from '../components/SuccessDialog';
import showErrorMessage from '../components/ErrorDialog';
import { SplitCreationPayload } from '../../store/types';
import { createSplit, resetSplitState } from '../../store/slices/splitSlice';

const CreatePersonalExpenseScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useDispatch<AppDispatch>();

    const [details, setDetails] = React.useState({
        amount: '',
        title: '',
        desc: '',
    });

    const { loading, success } = useSelector((state: RootState) => state.split);

    useEffect(() => {
        if (success) {
            showSuccessMessage('Expense created successfully');
            setTimeout(() => navigation.goBack(), 500);
        }
        return () => {
            dispatch(resetSplitState());
        };
    }, [success, navigation, dispatch]);

    const handleCreateSplit = async () => {
        try {
            if (!details.title.trim() || details.amount.trim() === '') {
                showErrorMessage('Expense title is required');
                return;
            }
            const payload: SplitCreationPayload = {
                group_id: 'groupId',
                amount: parseFloat(details.amount.trim()),
                title: details.title.trim(),
                description: details.desc.trim(),
            };
            console.log('Group creation payload:', payload);
            await dispatch(createSplit(payload)).unwrap();
        } catch (err) {
            console.log('Create group error:', err);
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
                <Text style={styles.appBarText}>Add Personal Expense</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Amount"
                placeholderTextColor="#ABB5B5"
                keyboardType="numeric"
                value={details.amount}
                onChangeText={(text) => setDetails({ ...details, amount: text })}
            />
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
            <View style={styles.buttonBar}>
            <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            {loading ? (
                <ActivityIndicator
                    size="large"
                    color={theme.colors.primary[500]}
                    style={styles.loadingIndicator}
                />
            ) : <TouchableOpacity style={styles.actionButton} onPress={() => {
                    handleCreateSplit();
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
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 0.5,
        borderTopColor: '#333',
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    actionButton: {
        backgroundColor: theme.colors.secondary[900],
        width: '50%',
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
