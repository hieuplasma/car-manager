import { colors } from "@common"
import { formatMoney } from "@utils"
import React, { useCallback } from "react"
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

    const onChangeText = useCallback((text: string) => {
        if (keyboardType == 'numeric') onChangeValue(text.replaceAll(',', ''))
        else onChangeValue(text)
    }, [onChangeValue, keyboardType])
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ width: 100 }}>{title}</Text>
            <TextInput
                style={{
                    flex: 1, height: 40, marginLeft: 10, borderWidth: 1,
                    borderRadius: 5, paddingRight: 10,
                    borderColor: '#ccc', marginVertical: 5,
                    textAlign: 'right'
                }}
                placeholder={String(placeholder)}
                value={keyboardType == 'numeric' ? String(formatMoney(Number(value))) : String(value)}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
            />
        </View>
    )
})