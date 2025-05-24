import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, TextInput } from 'react-native-gesture-handler';
import theme from '../../styles/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

const SplitExpenseScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    return (
        <View style={styles.container}>
            <View style={styles.appBar}>
                <Text style={styles.appBarText}>Split Expense</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Amount"
                placeholderTextColor="#ABB5B5"
                keyboardType="numeric"
                // value={details.groupTitle}
                // onChangeText={(text) => setDetails({ ...details, groupTitle: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Title"
                placeholderTextColor="#ABB5B5"
                // value={details.groupTitle}
                // onChangeText={(text) => setDetails({ ...details, groupTitle: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                placeholderTextColor="#ABB5B5"
                // value={details.groupDesc}
                // onChangeText={(text) => setDetails({ ...details, groupDesc: text })}
            />
            <View style={styles.buttonBar}>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('SplitExpense')}>
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('SplitExpense')}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            </View>
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
    input: {
        backgroundColor: theme.colors.secondary[900],
        height: 50,
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
});

export default SplitExpenseScreen;
