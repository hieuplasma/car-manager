import React from "react";
import { Text } from 'react-native'
import SafeAreaView from "react-native-safe-area-view";

export interface CarControlParams {
    
}

export const CarControl = React.memo(() => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text>
                {"Điều xe"}
            </Text>
        </SafeAreaView>
    )
})