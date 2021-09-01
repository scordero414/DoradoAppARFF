import React from 'react';
import { StyleSheet, Text, View, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CreateUser from './screens/CreateUser';
import LogIn from './screens/LogIn';
import Home from './screens/Home';
import HomeUser from './screens/HomeUser';
import InfoQR from './screens/InfoQR';
import ScannedQR from './screens/ScannedQR';

const Stack = createStackNavigator();
LogBox.ignoreLogs(['Setting a timer']);

function MyStack() {
  return (
    <Stack.Navigator initialRouteName="Home" headerMode="none">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="LogIn" component={LogIn} />
      <Stack.Screen name="CreateUser" component={CreateUser} />
      <Stack.Screen name="HomeUser" component={HomeUser} />
      <Stack.Screen name="InfoQR" component={InfoQR} />
      <Stack.Screen name="ScannedQR" component={ScannedQR} />
      {/* <Stack.Screen name="UserDetails" component={UserDetails}/> */}
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack></MyStack>
    </NavigationContainer>
  );
}

