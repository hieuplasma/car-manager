import React, { useCallback, useEffect, useState } from "react";
import { colors, dimensions, images } from "@common";
import { HomeStackParamList, NavigationUtils } from "@navigation";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import SafeAreaView from "react-native-safe-area-view";
import { useSelector } from "react-redux";
import FastImage from 'react-native-fast-image'
import { displayLocalNotification, formatMoney } from "@utils";
import { objmap } from "./mapping";
import { ModalConfirmBuse, ModalExtra } from "@components";

export interface DriverScreenParams { }

type NavigationProp = StackNavigationProp<HomeStackParamList, 'CarControl'>;

export const DriverScreen = React.memo(() => {

    const navigation = useNavigation<NavigationProp>();
    const isFocused = useIsFocused()
    const user = useSelector((state: any) => state.authReducer)

    const [fetched, setFetched] = useState(false)

    const [listBuses, setListBuses] = useState<any>([])
    const [listExtra, setListExtra] = useState<any>([])
    const [listExtraType, setListExtraType] = useState<any>([])

    const [currentBuse, setCurrentBuse] = useState<any>(false)
    const [isVisible, setIsVisible] = useState(false)
    const [isVisibleExtra, setIsVisibleExtra] = useState(false)

    const getInitData = useCallback(async () => {

        await fetch("/api/LAI_XE_NHAN_CHUYEN")
            .then((res) => res.json())
            .then((json) => setListBuses(json.data))

        await fetch("/api/PHI_PHAT_SINH")
            .then((res) => res.json())
            .then((json) => setListExtraType(json.data))

        setFetched(true)
    }, [])

    useEffect(() => {
        getInitData()
    }, [isFocused])

    const renderUser = useCallback(() => {
        return (
            <View style={styles.rowHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
                    <FastImage source={images.logout} style={{ width: 14, height: 14 }} tintColor={'#FFF'} />
                </TouchableOpacity>
                <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 12 }}>
                    {`${user.maKh} (${user.tenKh})`}
                </Text>
            </View>
        )
    }, [user])

    const renderSpecialKey = useCallback((key: string, value: string | number) => {
        if (key == 'ngay_Chay') return new Date(value).toLocaleDateString('vi')
        if (key == 'trong_Tai' || key == 'cuoc_Thu' || key == 'cuoc_Chi') return formatMoney(Number(value))
        if (key == 'phe_Duyet') {
            if (value == 0) return 'Đã từ chối'
            if (value == 1) return 'Chưa phê duyệt'
            if (value == 2) return 'Đã phê duyệt'
        }
        return value
    }, [])

    const renderBuses = useCallback(({ item, index }: any) => {
        const rows = []
        for (const element of objmap) {
            if (!element.title) continue
            rows.push(
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }} key={element.key}>
                    <Text>
                        {element.title + ': '}
                    </Text>
                    <Text>
                        {renderSpecialKey(element.key, item[element.key]) || element.default}
                    </Text>
                </View>
            )
        }

        const colorConfirm = item.phe_Duyet == 0 ? 'red' : (item.phe_Duyet == 1 ? 'orange' : 'green')
        return (
            <View style={styles.rowItem}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: -5 }}>
                    <Text style={{ fontWeight: 'bold' }}>{`Chuyến đi #${item.iD_Tang_VT}`}</Text>
                    <TouchableOpacity onPress={() => {
                        setCurrentBuse(item)
                        setIsVisible(true)
                    }}>
                        <FastImage source={images.edit} style={{ width: 14, height: 14 }} tintColor={colors.mainBtn} />
                    </TouchableOpacity>
                </View>
                {rows}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
                    <Text>
                        {'Trạng thái duyệt' + ': '}
                    </Text>
                    <Text style={{ color: colorConfirm }}>
                        {renderSpecialKey('phe_Duyet', item['phe_Duyet'])}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
                    <Text>
                        {'Đề nghị thanh toán thêm' + ': '}
                    </Text>
                    <View style={styles.rowView}>
                        {
                            item.de_Nghi_TT_ID ?
                                <TouchableOpacity style={{ padding: 4 }} onPress={() => {
                                    setCurrentBuse(item)
                                    setIsVisibleExtra(true)
                                }}>
                                    <FastImage source={images.edit} tintColor={'orange'} style={{ width: 16, height: 16 }} />
                                </TouchableOpacity>
                                : <TouchableOpacity style={{ padding: 4 }} onPress={() => {
                                    setCurrentBuse(item)
                                    setIsVisibleExtra(true)
                                }}>
                                    <FastImage source={images.plus} tintColor={'green'} style={{ width: 16, height: 16 }} />
                                </TouchableOpacity>
                        }
                    </View>
                </View>
            </View>
        )
    }, [])

    const onCancel = useCallback(() => {
        setIsVisible(false)
        setTimeout(() => setCurrentBuse(false), 50)
    }, [])

    const onCancelExtra = useCallback(() => {
        setIsVisibleExtra(false)
        setTimeout(() => setCurrentBuse(false), 50)
    }, [])

    const updateBuse = useCallback(async (buse: any) => {
        let tmp = [...listBuses]
        const index = tmp.findIndex(it => it.iD_Tang_VT == buse.iD_Tang_VT)
        tmp[index] = buse
        setListBuses(tmp)
        displayLocalNotification({
            title: 'Đã cập nhật chuyến đi',
            body: 'Đã cập nhật thông tin cho chuyến đi #' + buse.iD_Tang_VT,
            messageId: buse.iD_Tang_VT,
            dataType: 'update'
        })
    }, [listBuses])

    const addExtra = useCallback(async (extra: any) => {
        const tmp = [...listExtra]
        let maxId = 0
        for (const element of tmp) {
            if (element.idTangDeNghi > maxId) maxId = element.idTangDeNghi
        }
        tmp.push({ ...extra, idTangDeNghi: maxId + 1 })
        setListExtra(tmp)

        let tmp2 = [...listBuses]
        const index2 = tmp2.findIndex(it => it.iD_Tang_VT == extra.iD_Tang_VT)
        tmp2[index2].de_Nghi_TT_ID = maxId + 1
        setListBuses(tmp2)
    }, [listExtra, listBuses])

    const updateExtra = useCallback(async (extra: any) => {
        let tmp = [...listExtra]
        const index = tmp.findIndex(it => it.idTangDeNghi == extra.idTangDeNghi)
        tmp[index] = extra
        setListExtra(tmp)
    }, [listExtra])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {renderUser()}
            <FlatList
                data={listBuses}
                renderItem={renderBuses}
                keyExtractor={(item: any, index) => item.iD_Tang_VT}
                ListFooterComponent={() => <View style={{ height: 200 }} />}
            />
            {fetched && isVisible &&
                <ModalConfirmBuse
                    modalVisisble={isVisible}
                    onCancel={onCancel}
                    updateBuse={updateBuse}
                    currentBuse={currentBuse}
                />
            }
            {fetched && isVisibleExtra &&
                <ModalExtra
                    modalVisisble={isVisibleExtra}
                    onCancel={onCancelExtra}
                    currentExtraId={currentBuse.de_Nghi_TT_ID}
                    currentBuseId={currentBuse.iD_Tang_VT}
                    LIST_EXTRA={listExtra}
                    LIST_EXTRA_TYPE={listExtraType}
                    addExtra={addExtra}
                    updateExtra={updateExtra}
                />
            }
        </SafeAreaView>
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