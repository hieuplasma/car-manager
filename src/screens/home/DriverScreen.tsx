import React from "react";
import { Text } from 'react-native'
import SafeAreaView from "react-native-safe-area-view";

export interface DriverScreenParams {
    
}

export const DriverScreen = React.memo(() => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text>
                {"Màn hình tài xế"}
            </Text>
        </SafeAreaView>
    )
})