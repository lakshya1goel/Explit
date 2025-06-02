import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ListRenderItem, ActivityIndicator, Image, Pressable } from 'react-native';
import theme from '../../styles/theme';
import { NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import ws from '../../services/WebsocketService';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchChatHistory, resetChatState } from '../../store/slices/chatSlics';
import showErrorMessage from '../components/ErrorDialog';
import { Message, MessageItem } from '../../store/types/chat';

const ChatScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [messages, setMessages] = useState<MessageItem[]>();
  const [inputMessage, setInputMessage] = useState('');
  const [isPreparingMessages, setIsPreparingMessages] = useState(true);
  const route = useRoute<RouteProp<RootStackParamList, 'Chat'>>();
  const { groupId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const { loading, success, data } = useSelector((state: RootState) => state.chat);

  const handleFetchHistory = useCallback(async () => {
    try {
      await dispatch(fetchChatHistory(Number(groupId))).unwrap();
    } catch (err) {
      console.log('Fetch chat history error:', err);
      if (typeof err === 'string') {
        showErrorMessage(err);
      } else if (err instanceof Error) {
        showErrorMessage(err.message);
      } else {
        showErrorMessage('Chat history fetching failed');
      }
    }
  }, [dispatch, groupId]);

  useFocusEffect(
    useCallback(() => {
      handleFetchHistory();
    }, [handleFetchHistory])
  );

  useEffect(() => {
    const prepareMessages = async () => {
      if (!success || !data) {return;}
      setIsPreparingMessages(true);
      const combined: MessageItem[] = [
        ...(data.expenses || []).map((expense): MessageItem => ({
          msg: null,
          expense: expense,
        })),
        ...(data.messages || []).map((message): MessageItem => ({
          msg: message,
          expense: null,
        })),
      ];
      combined.sort((a, b) => {
        const dateA = new Date(a.msg?.CreatedAt || a.expense?.CreatedAt || '').getTime();
        const dateB = new Date(b.msg?.CreatedAt || b.expense?.CreatedAt || '').getTime();
        return dateA - dateB;
      });
      setMessages(combined);
      setIsPreparingMessages(false);
    };
    prepareMessages();
  }, [success, data]);

  useEffect(() => {
    if (success) {
      dispatch(resetChatState());
    }
  }, [success, dispatch]);

  useEffect(() => {
    return () => {
      ws.leaveGroup();
    };
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const tempMessage: Message = {
        ID: Date.now().toString(),
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
        DeletedAt: null,
        type: 'text',
        body: inputMessage,
        sender: data?.user_id || 0,
        group_id: Number(data?.id) || 0,
      };
      const newMessage: MessageItem = {
        msg: tempMessage,
        expense: null,
      };
      setMessages(prev => [...(prev || []), newMessage]);
      ws.sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const renderItem: ListRenderItem<MessageItem> = ({ item }) => {
    if (item.expense) {
      const expense = item.expense;
      const isSelf = expense.user_id === data?.user_id;
      const isPaid = expense.paid_by_count === data?.total_users ? 'Paid' : data?.total_users - expense.paid_by_count + ' Left';
      return (
        <View style={isSelf ? styles.sentCard : styles.receivedCard}>
          <Text style={styles.label}>
            {isSelf ? 'Payment Sent' : 'Payment Received'}
          </Text>
          <Text style={styles.amount}>₹{expense.amount}</Text>
          <Text style={styles.date}>
              {isPaid} • {new Date(expense.CreatedAt).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
          </Text>
        </View>
      );
    }

    if (item.msg) {
      const msg = item.msg;
      const isSelf = msg.sender === data?.user_id;
      return (
        <View
          style={[
            styles.chatBubble,
            isSelf ? styles.selfChat : styles.otherChat,
          ]}
        >
          <Text style={styles.chatText}>{msg.body}</Text>
          <Text style={styles.date}>
            {new Date(msg.CreatedAt).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.appBarText}>{data.name}</Text>
        <Pressable onPress={() => navigation.navigate('GroupSummary', { groupId: groupId })}>
          <Image source={require('../../../assets/icons/bill.png')} style={styles.bill} />
        </Pressable>
      </View>

      {(loading || isPreparingMessages) ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary[500]}
          style={styles.loadingIndicator}
        />
      ) : (
        <FlatList
          data={messages}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainerStyle}
        />
      )}

      <View style={styles.inputBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('SplitExpense', { groupId: groupId })}
        >
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  bill: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
  receivedCard: {
    backgroundColor: theme.colors.secondary[800],
    borderRadius: 12,
    width: '60%',
    padding: 15,
    marginVertical: 5,
  },
  sentCard: {
    backgroundColor: theme.colors.secondary[800],
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
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;
