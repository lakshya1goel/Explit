import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-gesture-handler';
import { RootStackParamList } from '../../../types';
import { useEffect, useState } from 'react';
import AuthService from '../../../services/AuthService';
import theme from '../../../styles/theme';

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
            navigation.navigate('Home');
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
    <View style={styles.container}>
      <Image source={require('../../../../assets/images/explit_logo.png')} style={styles.logo} />
      <Text style={styles.heading}>Explit</Text>
      {loading && <ActivityIndicator size="large" color={theme.colors.primary[500]} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background[950],
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
});

export default SplashScreen;
