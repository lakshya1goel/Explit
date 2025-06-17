import React, { useEffect } from 'react';
import { Alert, View, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

type InviteRouteProp = RouteProp<RootStackParamList, 'Invite'>;

const InviteScreen = () => {
    const route = useRoute<InviteRouteProp>();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { groupId } = route.params;

    useEffect(() => {
        Alert.alert(
            "Group Invitation",
            "Do you want to join this group?",
            [
                {
                text: "Decline",
                style: "cancel",
                onPress: () => navigation.goBack(),
                },
                {
                text: "Accept",
                onPress: () => {
                    // You can call backend API here if needed
                    navigation.navigate("Chat", { groupId });
                }
                }
            ],
            { cancelable: false }
        );
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
    );
};

export default InviteScreen;
