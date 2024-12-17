import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './homescreen';
import DarshanScreen from './darshantiming';
import PushNotificationHandler from './PushNotificationHandler'; // Make sure this path is correct
import {Platform} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    // Configure notifications and create channel
    PushNotificationHandler.configure();
    PushNotificationHandler.createChannel('test-channel'); // Replace 'test-channel' with your channelId

    // Hide splash screen after configurations are done
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'grey',
          headerShown: false, // This hides the header
          tabBarShowLabel: false,
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({size, color}) => (
              <FontAwesome5 name="home" size={size} color="color" />
            ),
          }}
        />
        <Tab.Screen
          name="Darshan Time"
          component={DarshanScreen}
          options={{
            tabBarIcon: ({size, color}) => (
              <FontAwesome5 name="clock" size={size} color="color" />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
