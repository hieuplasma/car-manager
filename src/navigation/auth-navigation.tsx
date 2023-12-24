import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen, LoginScreenParams } from "@screens";
import React from "react";

export type AuthStackParamList = {
  Login: LoginScreenParams
};

const AuthStack = createStackNavigator<AuthStackParamList>();

export function AuthNavigation() {
  return (
    <AuthStack.Navigator
      initialRouteName={"Login"}
      screenOptions={{
        header: undefined
      }}
    >
      <AuthStack.Screen
        name={'Login'}
        component={LoginScreen}
        options={{
          headerShown: false,
          title: '',
          animationEnabled: true,
        }}
      />

    </AuthStack.Navigator>
  )
}