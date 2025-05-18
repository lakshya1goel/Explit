import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Pressable, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import theme from '../styles/theme';

const ContactScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Contact'>>();
  const { contacts } = route.params;

  const [selectedPhoneNumbers, setSelectedPhoneNumbers] = useState<Set<string>>(new Set());
  const [groupTitle, setGroupTitle] = useState('');
  const [groupDesc, setGroupDesc] = useState('');

  const cleanPhoneNumber = (number: string): string => {
    return number.replace(/\D/g, '').replace(/^91/, '');
  };

  const toggleSelect = (phoneNumber: string) => {
    const cleaned = cleanPhoneNumber(phoneNumber);
    setSelectedPhoneNumbers(prev => {
      const newSet = new Set(prev);
      newSet.has(cleaned) ? newSet.delete(cleaned) : newSet.add(cleaned);
      return newSet;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <TextInput
          style={styles.input}
          placeholder="Group Title"
          placeholderTextColor="#ABB5B5"
          value={groupTitle}
          onChangeText={setGroupTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Group Description"
          placeholderTextColor="#ABB5B5"
          value={groupDesc}
          onChangeText={setGroupDesc}
        />
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item, index) => item.phoneNumbers?.[0]?.number || index.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const phoneNumberRaw = item.phoneNumbers?.[0]?.number;
          const cleaned = phoneNumberRaw ? cleanPhoneNumber(phoneNumberRaw) : '';
          const isSelected = selectedPhoneNumbers.has(cleaned);
          return (
            <Pressable
              onPress={() => phoneNumberRaw && toggleSelect(phoneNumberRaw)}
              style={[
                styles.card,
                isSelected && styles.selectedItem,
              ]}
            >
              <Text style={styles.nameText}>{item.displayName || 'No Name'}</Text>
              <Text style={styles.phoneText}>{phoneNumberRaw || 'No Phone Number'}</Text>
            </Pressable>
          );
        }}
      />

      {selectedPhoneNumbers.size > 0 && (
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerContainer}>
              <Text style={styles.selectedPhoneText}>
                {[...selectedPhoneNumbers].slice(0, 5).join(', ')}
                {selectedPhoneNumbers.size > 5 ? '...' : ''}
              </Text>
            </View>
            <Pressable style={styles.tickButton} onPress={() => console.log('Tick pressed')}>
              <Text style={styles.tickText}>✔</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1 ,
    backgroundColor: theme.colors.background[950],
  },
  appBar: {
    padding: 10,
    backgroundColor: '#000',
    elevation: 10,
  },
  input: {
    backgroundColor: theme.colors.secondary[900],
    padding: 10,
    marginVertical: 5,
    borderRadius: 6,
  },
  listContent: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  card: {
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: theme.colors.background[700],
  },
  selectedItem: {
    backgroundColor: theme.colors.background[400],
  },
  nameText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  phoneText: {
    color: '#fff',
  },
  footer: {
    padding: 10,
    borderTopWidth: 1,
    backgroundColor: '#000',
    shadowColor: '#fff',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerContainer: {
    flex: 1,
  },
  selectedPhoneText: {
    marginTop: 4,
    color: '#fff',
  },
  tickButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  tickText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ContactScreen;
