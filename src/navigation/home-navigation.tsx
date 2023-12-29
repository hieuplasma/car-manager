import { createStackNavigator } from "@react-navigation/stack";
import { CarControl, CarControlParams, DriverScreen, DriverScreenParams } from "@screens";
import React from "react";
import { useSelector } from "react-redux";

export type HomeStackParamList = {
    CarControl: CarControlParams,
    DriverScreen: DriverScreenParams
};

const Stack = createStackNavigator<HomeStackParamList>();

export function HomeNavigation() {

    const idCustomer = useSelector((state: any) => state.authReducer.loaiKhach)
    return (
        <Stack.Navigator
            initialRouteName={idCustomer == 'manager' ? 'CarControl' : 'DriverScreen'}
            screenOptions={{
                header: undefined
            }}
        >
            <Stack.Screen
                name={'CarControl'}
                component={CarControl}
                options={{
                    headerShown: false,
                    title: '',
                    animationEnabled: true,
                }}
            />
            <Stack.Screen
                name={'DriverScreen'}
                component={DriverScreen}
                options={{
                    headerShown: false,
                    title: '',
                    animationEnabled: true,
                }}
            />
        </Stack.Navigator>
    )
}