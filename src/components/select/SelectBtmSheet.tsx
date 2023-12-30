import { colors } from "@common";
import { Select, CheckIcon, ThreeDotsIcon } from "native-base";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
    title: string,
    selectedValue: string | number,
    onValueChange: (value: string | number) => void,
    listChoose: any[],
    keyValue: string,
    keyLabel: string | string[],
    width?: string | number
}

export const SelectBtmSheet = React.memo(({
    title,
    selectedValue,
    onValueChange,
    listChoose,
    keyValue,
    keyLabel,
    width
}: Props) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ width: title ? 100 : 0 }}>{title}</Text>
            <View style={[styles.dropdown, { backgroundColor: 'transparent', flex: 1 }]}>
                <Select
                    width={width ? width : '100%'}
                    height={30}
                    //@ts-ignore
                    style={{ textAlign: 'right', color: 'black' }}
                    _selectedItem={{
                        endIcon: <CheckIcon size={4} style={{ marginTop: 3 }} />,
                    }}
                    selectedValue={String(selectedValue)}
                    onValueChange={onValueChange}
                    dropdownIcon={<ThreeDotsIcon size={3} style={{ marginRight: 5, marginTop: -3 }} />}
                >
                    {
                        listChoose.map((item, index) => (
                            <Select.Item
                                value={String(item[keyValue])}
                                label={typeof keyLabel == 'string' ? item[keyLabel] : item[keyLabel[0]] + ' - ' + item[keyLabel[1]]}
                                key={item[keyValue]}
                            />
                        ))
                    }
                </Select>
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    dropdown: { padding: 5, borderRadius: 5, backgroundColor: colors.item_bg, marginVertical: 5, paddingRight: 0 },
})