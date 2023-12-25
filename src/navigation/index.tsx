import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Platform, PermissionsAndroid } from 'react-native';
import { AuthNavigation } from './auth-navigation';
import { HomeNavigation } from './home-navigation';
import * as RootNavigationUtils from './root-navigation-utils';
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react'
import notifee from '@notifee/react-native';


export type RootStackParamsList = {
    Auth: {};
    Home: {};
};

const RootStack = createStackNavigator<RootStackParamsList>();

export function RootNavigation(params?: {}) {

    async function requestPermissions() {
        if (Platform.OS == 'android') {
            const authorizationStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
            if (authorizationStatus == PermissionsAndroid.RESULTS.GRANTED) getFCMToken()
        }
        else {
            const authorizationStatus = await messaging().requestPermission();
            if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
                getFCMToken();
            } else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
                getFCMToken();
            } else {
                console.log('User has notification permissions disabled');
            }
        }
    }

    const getFCMToken = () => {

    }

    useEffect(() => {
        requestPermissions()
        const subscribe = messaging().onMessage(async remoteMessage => {
            localDisplayNotification(remoteMessage)
        })

        return subscribe
    }, [])

    const localDisplayNotification = async (remoteMessage: any) => {
        const channelId = await notifee.createChannel({
            id: remoteMessage.messageId,
            name: 'Default Channel'
        })

        await notifee.displayNotification({
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            android: {
                channelId,
                // smallIcon: 'ic_stat_name',
                localOnly: true,
                pressAction: {
                    id: remoteMessage.messageId,
                    launchActivity: 'default'
                },
            },
            data: {
                type: remoteMessage.data?.type
            }
        })
    }

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