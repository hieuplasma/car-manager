import { colors, dimensions } from "@common";
import { TextArea } from "native-base";
import React, { useCallback, useEffect, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Modal from "react-native-modal";

interface ModalProps {
    modalVisisble: boolean,
    onCancel: () => void,
    updateBuse: (buse: any) => void,
    currentBuse: any,
}
export const ModalConfirmBuse = React.memo(({
    modalVisisble,
    currentBuse,
    onCancel,
    updateBuse,
}: ModalProps) => {

    const cancelModal = useCallback(() => {
        onCancel()
    }, [onCancel])

    const [status, setStatus] = useState(currentBuse.phe_Duyet)
    const [reason, setReason] = useState(currentBuse.ghi_Chu || '')

    const confirm = useCallback(() => {
        updateBuse({
            ...currentBuse,
            phe_Duyet: status,
            ghi_Chu: status == 0 ? reason : null
        })
        onCancel()
    }, [onCancel, updateBuse,
        currentBuse,
        status, reason])

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
                        {"Phê duyệt chuyến đi"}
                    </Text>
                    <View style={{ width: '100%', height: 1, backgroundColor: 'gray', opacity: 0.5, marginBottom: 5 }} />

                    <View style={[styles.rowView, { justifyContent: 'space-evenly' }]}>
                        <TouchableOpacity style={[styles.rowView]} onPress={() => setStatus(2)}>
                            <Text style={{ color: status == 2 ? 'green' : 'black' }}>{"Phê duyệt"}</Text>
                            <View style={[styles.circle, { borderColor: status == 2 ? 'green' : '#ccc' }]} >
                                <View style={[styles.inside, { borderColor: status == 2 ? 'green' : '#ccc', backgroundColor: status == 2 ? 'green' : 'transparent' }]} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rowView} onPress={() => setStatus(0)}>
                            <Text style={{ color: status == 0 ? 'red' : 'black' }}>{"Từ chối"}</Text>
                            <View style={[styles.circle, { borderColor: status == 0 ? 'red' : '#ccc' }]} >
                                <View style={[styles.inside, { borderColor: status == 0 ? 'red' : '#ccc', backgroundColor: status == 0 ? 'red' : 'transparent' }]} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {
                        status == 0 &&
                        <>
                            <Text style={{ marginTop: 10 }}>{"Lý do từ chối"}</Text>
                            <TextArea
                                marginTop={1}
                                value={reason}
                                onChangeText={setReason}
                                autoCompleteType={'string'}
                            />
                        </>
                    }

                    <View style={{ flex: 1 }} />

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
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{!currentBuse ? 'Thêm' : 'Cập nhật'}</Text>
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
        height: 300,
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