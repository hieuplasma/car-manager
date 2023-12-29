import { colors } from "@common"
import React from "react"
import { KeyboardTypeOptions, Text, TextInput, View } from "react-native"

interface Props {
    title: string,
    placeholder: string | number,
    value: string | number,
    onChangeValue: (value: string | number) => void,
    keyboardType?: KeyboardTypeOptions
}
export const MyInput = React.memo(({
    title,
    placeholder,
    value,
    onChangeValue,
    keyboardType
}: Props) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ width: 100 }}>{title}</Text>
            <TextInput
                style={{ flex: 1, height: 40, marginLeft: 10, borderWidth: 1, borderRadius: 5, paddingLeft: 10, borderColor: '#ccc', marginVertical: 5 }}
                placeholder={String(placeholder)}
                value={String(value)}
                onChangeText={onChangeValue}
                keyboardType={keyboardType}
            />
        </View>
    )
})