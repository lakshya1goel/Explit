import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ListRenderItem } from 'react-native';
import theme from '../../styles/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

type MessageItem = {
  id: string;
  type: 'payment_sent' | 'payment_received' | 'text';
  amount?: number;
  date?: string;
  message?: string;
  sender?: 'self' | 'other';
};

const initialMessages: MessageItem[] = [
  { id: '1', type: 'payment_sent', amount: 55, date: '3 Apr, 12:43 pm' },
  { id: '3', type: 'payment_received', amount: 1500, date: '4 Apr, 9:04 am' },
  { id: '4', type: 'text', message: 'Hey, did you send the amount?', sender: 'other' },
  { id: '5', type: 'text', message: 'Yes, sent ₹55 just now.', sender: 'self' },
];

const ChatScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: MessageItem = {
        id: Date.now().toString(),
        type: 'text',
        message: inputMessage,
        sender: 'self',
      };
      setMessages((prev) => [...prev, newMessage]);
      setInputMessage('');
    }
  };

  const renderItem: ListRenderItem<MessageItem> = ({ item }) => {
    switch (item.type) {
      case 'payment_sent':
        return (
          <View style={styles.sentCard}>
            <Text style={styles.label}>Payment Sent</Text>
            <Text style={styles.amount}>₹{item.amount}</Text>
            <Text style={styles.date}>Paid • {item.date}</Text>
          </View>
        );
      case 'payment_received':
        return (
          <View style={styles.receivedCard}>
            <Text style={styles.label}>Payment Received</Text>
            <Text style={styles.amount}>₹{item.amount}</Text>
            <Text style={styles.date}>Paid • {item.date}</Text>
          </View>
        );
      case 'text':
        return (
          <View
            style={[
              styles.chatBubble,
              item.sender === 'self' ? styles.selfChat : styles.otherChat,
            ]}
          >
            <Text style={styles.chatText}>{item.message}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
          <Text style={styles.appBarText}>Group</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
      />

      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('SplitExpense')}>
          <Text style={styles.buttonText}>Split Expense</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Message..."
          placeholderTextColor="#aaa"
          value={inputMessage}
          onChangeText={setInputMessage}
          onSubmitEditing={sendMessage}
        />
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
  receivedCard: {
    backgroundColor: theme.colors.secondary[950],
    borderRadius: 12,
    width: '60%',
    padding: 15,
    marginVertical: 5,
  },
  sentCard: {
    backgroundColor: theme.colors.primary[950],
    borderRadius: 12,
    width: '60%',
    padding: 15,
    marginVertical: 5,
    alignSelf: 'flex-end',
  },
  contentContainerStyle: {
    padding: 15,
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  subLabel: {
    color: '#bbb',
    marginTop: 5,
  },
  amount: {
    color: 'white',
    fontSize: 24,
    marginTop: 5,
  },
  date: {
    color: '#888',
    marginTop: 5,
  },
  chatBubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  selfChat: {
    backgroundColor: theme.colors.primary[950],
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  otherChat: {
    backgroundColor: theme.colors.secondary[950],
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  chatText: {
    color: '#fff',
    fontSize: 16,
  },
  inputBar: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#333',
    backgroundColor: '#000',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: 'white',
    backgroundColor: theme.colors.secondary[900],
    borderRadius: 10,
    paddingHorizontal: 10,
    marginLeft: 10,
    height: 40,
  },
  actionButton: {
    backgroundColor: theme.colors.secondary[900],
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginRight: 5,
  },
  buttonText: {
    color: 'white',
  },
});

export default ChatScreen;
