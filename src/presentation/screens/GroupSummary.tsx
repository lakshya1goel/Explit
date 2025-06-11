import React, { useCallback, useEffect, useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import theme from '../../styles/theme';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchGroupSummary, resetGroupSummaryState } from '../../store/slices/groupSummarySlice';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import showErrorMessage from '../components/ErrorDialog';
import { FlatList } from 'react-native-gesture-handler';
import { UserSummaryItem } from '../../store/types/groupSummary';

const GroupSummaryScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'GroupSummary'>>();
  const { groupId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const { loading, success, data } = useSelector((state: RootState) => state.groupSummary);
  const [isPreparingList, setIsPreparingList] = useState(true);
  const [owedToList, setOwedToList] = useState<UserSummaryItem[]>();
  const [owedByList, setOwedByList] = useState<UserSummaryItem[]>();
  const [setteldList, setSettledList] = useState<UserSummaryItem[]>([]);

  const handleFetchSummary = useCallback(async () => {
    try {
      await dispatch(fetchGroupSummary(Number(groupId))).unwrap();
    } catch (err) {
      console.log('Fetch group summary error:', err);
      if (typeof err === 'string') {
        showErrorMessage(err);
      } else if (err instanceof Error) {
        showErrorMessage(err.message);
      } else {
        showErrorMessage('Group summary fetching failed');
      }
    }
  }, [dispatch, groupId]);

  useFocusEffect(
    useCallback(() => {
      handleFetchSummary();
    }, [handleFetchSummary])
  );

  useEffect(() => {
    const prepareList = async () => {
      if (!success || !data) {return;}
      setIsPreparingList(true);
      if (!data.settlements || data.settlements.length === 0) {
        setOwedToList([]);
        setOwedByList([]);
        setSettledList([]);
        setIsPreparingList(false);
        return;
      }
      const owedToListFiltered: UserSummaryItem[] = data.settlements
      .filter((item) => item.settlement > 0)
      .map((item) => ({
        name: item.user_name.split('@')[0],
        amount: item.settlement,
        expenses: item.no_of_splits,
      }));

    const owedByListFiltered: UserSummaryItem[] = data.settlements
      .filter((item) => item.settlement < 0)
      .map((item) => ({
        name: item.user_name.split('@')[0],
        amount: Math.abs(item.settlement),
        expenses: item.no_of_splits,
      }));

    const settledListFiltered: UserSummaryItem[] = data.settlements
      .filter((item) => item.settlement === 0)
      .map((item) => ({
        name: item.user_name.split('@')[0],
        amount: Math.abs(item.settlement),
        expenses: item.no_of_splits,
      }));

    setOwedToList(owedToListFiltered);
    setOwedByList(owedByListFiltered);
    setSettledList(settledListFiltered);
    setIsPreparingList(false);
    };
    prepareList();
  }, [success, data]);

  useEffect(() => {
      if (success) {
        dispatch(resetGroupSummaryState());
      }
  }, [success, dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.appBarText}>Expenses</Text>
      </View>

      {(loading || isPreparingList) ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary[500]}
          style={styles.loadingIndicator}
        />
      ) : (
        <>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryBox}>
              <Text style={styles.owedByAmount}>₹{data.total_group_owed_by}</Text>
              <Text style={styles.subText}>Owed by you</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.owedToAmount}>₹{data.total_group_owed_to}</Text>
              <Text style={styles.subText}>Owed to you</Text>
            </View>
          </View>
          {(owedByList?.length ?? 0) > 0 && (
            <>
              <Text style={styles.sectionTitle}>Owed by you</Text>
              <FlatList
                data={owedByList}
                keyExtractor={(item, index) => `owed_by_${index}`}
                renderItem={({ item }) => (
                  <View style={styles.userRow}>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{item.name}</Text>
                      <Text style={styles.unpaid}>{item.expenses} expenses</Text>
                    </View>
                    <Text style={styles.owedByAmt}>₹{item.amount}</Text>
                  </View>
                )}
              />
            </>
          )}
          {(owedToList?.length ?? 0) > 0 && (
            <>
              <Text style={styles.sectionTitle}>Owed to you</Text>
              <FlatList
                data={owedToList}
                keyExtractor={(item, index) => `owed_to_${index}`}
                renderItem={({ item }) => (
                  <View style={styles.userRow}>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{item.name}</Text>
                      <Text style={styles.unpaid}>{item.expenses} expenses</Text>
                    </View>
                    <Text style={styles.owedToAmt}>₹{item.amount}</Text>
                  </View>
                )}
              />
            </>
          )}
          {(setteldList?.length ?? 0) > 0 && (
            <>
              <Text style={styles.sectionTitle}>Settled</Text>
              <FlatList
                data={setteldList}
                keyExtractor={(item, index) => `owed_to_${index}`}
                renderItem={({ item }) => (
                  <View style={styles.userRow}>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{item.name}</Text>
                      <Text style={styles.unpaid}>{item.expenses} expenses</Text>
                    </View>
                    <Text style={styles.owedToAmt}>₹{item.amount}</Text>
                  </View>
                )}
              />
            </>
          )}
        </>
      )}
      <TouchableOpacity style={styles.settleButton}>
        <Text style={styles.settleText}>Settle up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GroupSummaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background[950],
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
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.secondary[950],
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    marginTop: 10,
    marginHorizontal: 15,
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
    color: '#aaa',
    fontSize: 13,
    marginTop: 4,
  },
  sectionTitle: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary[900],
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    marginHorizontal: 15,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  unpaid: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 2,
  },
  owedByAmt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  owedToAmt: {
    color: theme.colors.success[500],
    fontSize: 16,
    fontWeight: '600',
  },
  settleButton: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: theme.colors.primary[500],
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  settleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
