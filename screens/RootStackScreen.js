import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import SplashScreen from './SplashScreen';
import SingInScreen from './SingInScreen';
import SingUpScreen from './SingUpScreen';


const RootStack = createStackNavigator();

export default () => {
    return(
        <RootStack.Navigator screenOptions={{
            headerShown:false
        }}>
            <RootStack.Screen name="SplasScreen" component={SplashScreen}/>
            <RootStack.Screen name="SingInScreen" component={SingInScreen}/>
            <RootStack.Screen name="SingUpScreen" component={SingUpScreen}/>
        </RootStack.Navigator>
    )
}