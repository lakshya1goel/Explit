import React, { useEffect } from 'react';
import { View, Text, FlatList, TextInput, Pressable, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import theme from '../../styles/theme';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { createGroup } from '../../store/slices/groupSlice';
import { GroupCreationPayload } from '../../store/types';
import showSuccessMessage from '../components/SuccessDialog';
import showErrorMessage from '../components/ErrorDialog';

const ContactScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Contact'>>();
  const { contacts } = route.params;
  const dispatch = useDispatch<AppDispatch>();

  const [details, setDetails] = React.useState({
    groupTitle: '',
    groupDesc: '',
    selectedPhoneNumbers: new Set<string>(),
  });

  const { loading, success } = useSelector((state: RootState) => state.group);

  const cleanPhoneNumber = (number: string): string => {
    return number.replace(/\D/g, '').replace(/^91/, '');
  };

  const toggleSelect = (phoneNumber: string) => {
    const cleaned = cleanPhoneNumber(phoneNumber);
    setDetails(prevDetails => {
      const updatedSet = new Set(prevDetails.selectedPhoneNumbers);
      if (updatedSet.has(cleaned)) {
        updatedSet.delete(cleaned);
      } else {
        updatedSet.add(cleaned);
      }
      return {
        ...prevDetails,
        selectedPhoneNumbers: updatedSet,
      };
    });
  };

  useEffect(() => {
    if (success) {
      showSuccessMessage('Group created successfully');
      setDetails({
        groupTitle: '',
        groupDesc: '',
        selectedPhoneNumbers: new Set(),
      });
    }
  }, [success]);

  const handleCreateGroup = async () => {
    try {
      if (!details.groupTitle.trim()) {
        showErrorMessage('Group title is required');
        return;
      }
      if (details.selectedPhoneNumbers.size === 0) {
        showErrorMessage('Select at least one contact');
        return;
      }
      const payload: GroupCreationPayload = {
        name: details.groupTitle.trim(),
        description: details.groupDesc.trim(),
        users: Array.from(details.selectedPhoneNumbers),
      };
      console.log('Group creation payload:', payload);
      await dispatch(createGroup(payload)).unwrap();
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
        <TextInput
          style={styles.input}
          placeholder="Group Title"
          placeholderTextColor="#ABB5B5"
          value={details.groupTitle}
          onChangeText={(text) => setDetails({ ...details, groupTitle: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Group Description"
          placeholderTextColor="#ABB5B5"
          value={details.groupDesc}
          onChangeText={(text) => setDetails({ ...details, groupDesc: text })}
        />
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item, index) => item.phoneNumbers?.[0]?.number || index.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const phoneNumberRaw = item.phoneNumbers?.[0]?.number;
          const cleaned = phoneNumberRaw ? cleanPhoneNumber(phoneNumberRaw) : '';
          const isSelected = details.selectedPhoneNumbers.has(cleaned);
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

      {details.selectedPhoneNumbers.size > 0 && (
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerContainer}>
              <Text style={styles.selectedPhoneText}>
                {[...details.selectedPhoneNumbers].slice(0, 5).join(', ')}
                {details.selectedPhoneNumbers.size > 5 ? '...' : ''}
              </Text>
            </View>
            <Pressable style={styles.tickButton} onPress={handleCreateGroup} disabled={loading}>
              <Text style={styles.tickText}>{loading ? '...' : '✔'}</Text>
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
    color: '#fff',
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
