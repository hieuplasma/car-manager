import { colors, dimensions, images } from "@common";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { SelectBtmSheet } from "../select";
import { MyInput } from "../textinput";
import FastImage from "react-native-fast-image";

interface ModalProps {
    modalVisisble: boolean,
    onCancel: () => void,
    addExtra: (extra: any) => void,
    updateExtra: (extra: any) => void,
    currentExtraId: any,
    currentBuseId: any,
    LIST_EXTRA: any[]
    LIST_EXTRA_TYPE: any[],
}

export const ModalExtra = React.memo(({
    modalVisisble,
    currentExtraId,
    currentBuseId,
    onCancel,
    updateExtra,
    addExtra,
    LIST_EXTRA,
    LIST_EXTRA_TYPE
}: ModalProps) => {

    const cancelModal = useCallback(() => {
        onCancel()
    }, [onCancel])

    const [currentExtra, setCurrentExtra] = useState<any>({})

    const [money, setMoney] = useState<string | number>(0)
    const [extraTypeId, setExtraTypeID] = useState<any[]>([0])

    useEffect(() => {
        const tmp = LIST_EXTRA.find(it => it.idTangDeNghi == currentExtraId)
        if (tmp) {
            setCurrentExtra(tmp)
            setMoney(tmp.so_tien)
            setExtraTypeID(tmp.iD_Tang_Phi)
        }
    }, [currentExtraId, LIST_EXTRA])

    const confirm = useCallback(() => {
        if (!currentExtraId) {
            addExtra({
                'iD_Tang_VT': currentBuseId,
                'so_tien': money,
                'iD_Tang_Phi': extraTypeId
            })
        }
        else {
            updateExtra({
                ...currentExtra,
                'so_tien': money,
                'iD_Tang_Phi': extraTypeId
            })
        }
        onCancel()
    }, [onCancel, currentExtra, money, extraTypeId, currentBuseId])

    const onChangeExtraTypeId = useCallback((id: number, index: number) => {
        let tmp = [...extraTypeId]
        tmp[index] = id
        setExtraTypeID(tmp)
    }, [extraTypeId])

    const addExtraType = useCallback(() => {
        let tmp = [...extraTypeId]
        tmp.push(0)
        setExtraTypeID(tmp)
    }, [extraTypeId])

    const removeExtraType = useCallback((index: number) => {
        if (extraTypeId.length == 1) return
        let tmp = [...extraTypeId]
        tmp[index] = -1
        setExtraTypeID(tmp)
    }, [extraTypeId])

    return (
        <Modal
            // animationIn={"fadeIn"}
            // animationOut={"fadeOut"}
            isVisible={modalVisisble}
            style={{ width: dimensions.widthScreen, height: dimensions.heightScreen, margin: 0 }}
        >
            <TouchableOpacity
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                onPress={cancelModal}
                activeOpacity={1}
            >
                <TouchableOpacity style={styles.modalView} activeOpacity={1} onPress={(() => { })}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, margin: 5 }}>
                        {"Cập nhật thanh toán thêm"}
                    </Text>
                    <View style={{ width: '100%', height: 1, backgroundColor: 'gray', opacity: 0.5, marginBottom: 5 }} />
                    <MyInput
                        title={"Số tiền"}
                        placeholder={0}
                        value={money}
                        onChangeValue={setMoney}
                        keyboardType={"numeric"}
                    />

                    <Text>
                        {"(Các) Loại phát sinh:"}
                    </Text>
                    <ScrollView>
                        <View>
                        {
                            extraTypeId.map((item, index) => (
                                item >= 0 &&
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} key={String(index)}>
                                    <SelectBtmSheet
                                        title={""}
                                        selectedValue={item}
                                        onValueChange={(id) => onChangeExtraTypeId(Number(id), index)}
                                        listChoose={LIST_EXTRA_TYPE}
                                        keyValue={'iD_Tang_Phi'}
                                        keyLabel={'noi_Dung_Phi'}
                                        width={'70%'}
                                    />
                                    <TouchableOpacity onPress={() => removeExtraType(index)} style={{ marginLeft: -100 }}>
                                        <FastImage style={{ width: 16, height: 16 }} source={images.remove} />
                                    </TouchableOpacity>
                                </View>
                            ))
                        }
                        </View>
                    </ScrollView>

                    <View style={{ flexDirection: 'row-reverse' }}>
                        <TouchableOpacity onPress={addExtraType}>
                            <FastImage style={{ width: 16, height: 16 }} source={images.plus} tintColor={'green'} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                        <TouchableOpacity
                            style={[styles.btn, { backgroundColor: colors.item_bg }]} activeOpacity={0.5}
                            onPress={onCancel}
                        >
                            <Text style={{ fontWeight: 'bold' }}>{"Huỷ"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btn, { backgroundColor: colors.mainBtn }]}
                            activeOpacity={0.5}
                            onPress={confirm}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{!currentExtraId ? 'Thêm' : 'Cập nhật'}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    )
})

const styles = StyleSheet.create({
    rowHeader: {
        height: 40,
        backgroundColor: colors.mainBtn,
        width: dimensions.widthScreen,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    rowItem: {
        width: dimensions.widthScreen - 20,
        marginHorizontal: 10,
        borderRadius: 10, padding: 10,
        backgroundColor: colors.item_bg,
        marginTop: 10
    },
    rowView: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    modalView: {
        margin: 10, width: dimensions.widthScreen - 20,
        height: 400,
        borderRadius: 10, backgroundColor: 'white',
        padding: 10
    },
    dropdown: { padding: 5, borderRadius: 5, backgroundColor: colors.item_bg, marginVertical: 5 },
    btn: {
        width: 100, height: 30, justifyContent: 'center', alignItems: 'center',
        borderRadius: 5,
        marginTop: 10, marginHorizontal: 10
    },
    circle: {
        width: 15, height: 15, borderRadius: 10, marginLeft: 10, borderWidth: 1,
        justifyContent: 'center', alignItems: 'center'
    },
    inside: {
        width: 10, height: 10, borderRadius: 10, borderWidth: 1
    }
})