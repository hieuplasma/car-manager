import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import { AuthNavigation } from './auth-navigation';
import { HomeNavigation } from './home-navigation';
import * as RootNavigationUtils from './root-navigation-utils';

export type RootStackParamsList = {
    Auth: {};
    Home: {};
};

const RootStack = createStackNavigator<RootStackParamsList>();

export function RootNavigation(params?: {}) {

    return (
        <View style={{ flex: 1 }}>
            <NavigationContainer ref={RootNavigationUtils.navigationRef}>
                <RootStack.Navigator
                    initialRouteName={'Auth'}
                    screenOptions={{
                        headerShown: false,
                        gestureEnabled: false,
                    }}>
                    <RootStack.Screen name={'Auth'} component={AuthNavigation} />
                    <RootStack.Screen
                        name={'Home'}
                        component={HomeNavigation}
                    />
                </RootStack.Navigator>
            </NavigationContainer>
        </View>
    );
}

export * from './auth-navigation'
export * from './home-navigation'
export * from './navigation-utils'