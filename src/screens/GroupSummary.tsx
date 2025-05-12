import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView} from 'react-native';

const GroupSummaryScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Expenses</Text>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <Text style={styles.amount}>₹25.00</Text>
          <Text style={styles.subText}>Owed by you</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={[styles.amount, { color: '#00C853' }]}>₹0.00</Text>
          <Text style={styles.subText}>Owed to you</Text>
        </View>
      </View>


      <Text style={styles.sectionTitle}>Owed by you</Text>
      <View style={styles.userRow}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/100' }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Ankit Varshney</Text>
          <Text style={styles.unpaid}>4 unpaid expenses</Text>
        </View>
        <Text style={styles.userAmount}>₹25.00</Text>
      </View>

      {/* Bottom Button */}
      <TouchableOpacity style={styles.settleButton}>
        <Text style={styles.settleText}>Settle up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default GroupSummaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
  },
  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#121212',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryBox: {
    flex: 1,
    alignItems: 'center',
  },
  amount: {
    color: '#fff',
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
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
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
  userAmount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  settleButton: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: '#2962FF',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  settleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
