import React from 'react';
import { View, Text, FlatList, TextInput, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '../../styles/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

const PersonalExpenseScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const personalExpenses = [
        { id: '1', name: 'Groceries', descprition: 'from lala sumit', amount: 150, date: '1/10/2024'},
        { id: '2', name: 'Utilities', descprition: 'from lala sumit', amount: 100, date: '1/10/2024'},
        { id: '3', name: 'Transport', descprition: 'from lala sumit', amount: 50, date: '1/10/2024'},
        { id: '4', name: 'Entertainment', descprition: 'from lala sumit', amount: 200, date: '1/10/2024'},
        { id: '5', name: 'Groceries', descprition: 'from lala sumit', amount: 150, date: '1/10/2024'},
        { id: '6', name: 'Utilities', descprition: 'from lala sumit', amount: 100, date: '1/10/2024'},
        { id: '7', name: 'Transport', descprition: 'from lala sumit', amount: 50, date: '1/10/2024'},
        { id: '8', name: 'Entertainment', descprition: 'from lala sumit', amount: 200, date: '1/10/2024'},
        { id: '9', name: 'Groceries', descprition: 'from lala sumit', amount: 150, date: '1/10/2024'},
        { id: '10', name: 'Utilities', descprition: 'from lala sumit', amount: 100, date: '1/10/2024'},
    ]
    return (
        <View style={styles.container}>
            <View style={styles.appBar}>
                <Text style={styles.appBarText}>Your Expenses</Text>
            </View>
            <FlatList
                data={personalExpenses}
                keyExtractor={(item, index) => item.id || index.toString()}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.card}>
                            <View>
                                <Text style={styles.nameText}>{item.name}</Text>
                                <Text style={styles.descText}>{item.descprition}</Text>
                            </View>
                            <View>
                                <Text style={styles.descText}>{item.date}</Text>
                                <Text style={styles.amtText}>₹{item.amount}</Text>
                            </View>
                        </View>
                    );
                }}
            />
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
