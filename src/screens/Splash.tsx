import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { Text } from 'react-native-gesture-handler';
import { RootStackParamList } from '../types';
import { useEffect, useState } from 'react';
import AuthService from '../services/AuthService';

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        const tokens = await AuthService.getToken();
        await new Promise(resolve => setTimeout(resolve, 4000));

        if (tokens) {
          const currentTime = new Date().getTime();
          const isTokenValid = currentTime < tokens.accessExpTime;

          if (isTokenValid) {
            navigation.navigate('Group');
          } else {
            navigation.navigate('Login');
          }
        } else {
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigation.navigate('Login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndNavigate();
  }, [navigation]);
  return (
    <View>
      <Text>Welcome to Explit!</Text>
      {loading && <ActivityIndicator size="large" color="#6366f1" />}
    </View>
  );
};

export default SplashScreen;
