import React, { useCallback, useEffect, useState } from "react";
import { colors, dimensions, images } from "@common";
import { HomeStackParamList, NavigationUtils } from "@navigation";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import SafeAreaView from "react-native-safe-area-view";
import { useSelector } from "react-redux";
import FastImage from 'react-native-fast-image'
import Modal from "react-native-modal";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Select, CheckIcon } from "native-base";
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

export interface CarControlParams {

}

type NavigationProp = StackNavigationProp<HomeStackParamList, 'CarControl'>;

const objmap: any = {
    'gio_Dat_Xe': "NGÀY THÁNG",
    'ten_Dia_Diem_DI': "ĐIỂM ĐI",
    'ten_Dia_Diem_Nhan': "ĐIỂM ĐẾN",
    'ma_KH': "MÃ KHÁCH HÀNG",
    'ten_KH': "TÊN KHÁCH HÀNG",
    'diem_Di': undefined,
    "diem_Nhan": undefined,
    "khach_Hang": undefined,
}

const FAKE_LIST_BUSES = [
    {
        "iD_Tang_VT": 1,
        "bien_Xe": 1,
        "ma_Xe": null,
        "bien_So_Xe": "2313134 ",
        "cuoc_Thu": null,
        "cuoc_Tra": null,
        "diem_Di": 1,
        "ten_Dia_Diem_DI": "Hà Nội",
        "diem_Nhan": 2,
        "ten_Dia_Diem_Nhan": "Nam Định",
        "ghi_Chu": null,
        "giao_nop_BB": null,
        "gio_Dat_Xe": '08/12/2023',
        "ma_KH": "Haid",
        "khach_Hang": 1,
        "ten_KH": "Công ty TNHH Haid",
        "loai_KH": 1,
        "nha_CC": 2,
        "ma_Nha_CC": "SS",
        "ngay_Chay": null,
        "nha_CC_Chot": null,
        "phe_Duyet": null,
        "pS_Chi": null,
        "pS_Thu": null,
        "so_seal_Chi": null,
        "trong_Tai": 20
    }
]

const LIST_POSISTION = [
    {
        "idTangDiemNhanGiao": 1,
        "tenDiaDiem": "Hà Nội"
    },
    {
        "idTangDiemNhanGiao": 2,
        "tenDiaDiem": "Nam Định"
    },
    {
        "idTangDiemNhanGiao": 1002,
        "tenDiaDiem": "SF Nội Bài (Kho ALSW)"
    },
    {
        "idTangDiemNhanGiao": 1003,
        "tenDiaDiem": "Hà Nội + Hưng Yên"
    },
    {
        "idTangDiemNhanGiao": 1004,
        "tenDiaDiem": "1. KHo Hải Phòng . 512 Nguyễn Văn Linh"
    },
    {
        "idTangDiemNhanGiao": 1005,
        "tenDiaDiem": "Vsip HP ( giao hàng của kho cho xe tải số 1 xuất hongkong)"
    },
    {
        "idTangDiemNhanGiao": 1006,
        "tenDiaDiem": " Regina Factory E"
    },
    {
        "idTangDiemNhanGiao": 1007,
        "tenDiaDiem": "Regina Factory D"
    },
    {
        "idTangDiemNhanGiao": 1008,
        "tenDiaDiem": "SINOWEL Thuận Thành, Bắc Ninh"
    },
    {
        "idTangDiemNhanGiao": 1009,
        "tenDiaDiem": "Phát Hàng và Lấy Hàng"
    },
    {
        "idTangDiemNhanGiao": 1010,
        "tenDiaDiem": "Cụm CN Vừa Và Nhỏ Từ Liêm"
    },
    {
        "idTangDiemNhanGiao": 1011,
        "tenDiaDiem": "Thanh Hoá"
    },
    {
        "idTangDiemNhanGiao": 1012,
        "tenDiaDiem": "Khu CN Hải Dương"
    }
]

const FAKE_USER = [
    {
        "idTangKhNcc": 1,
        "maKh": "KH_0001",
        "tenKh": "Công ty TNHH Haid",
        "diaChi": null,
        "loaiKhach": 2
    },
    {
        "idTangKhNcc": 2,
        "maKh": "KH_0002",
        "tenKh": "Công ty TNHH Hiếu",
        "diaChi": null,
        "loaiKhach": 2
    },
    {
        "idTangKhNcc": 3,
        "maKh": "SS",
        "tenKh": "Server",
        "diaChi": null,
        "loaiKhach": 2
    }
]

export const CarControl = React.memo(() => {

    const navigation = useNavigation<NavigationProp>();
    const isFocused = useIsFocused()
    const user = useSelector((state: any) => state.authReducer)

    const [listBuses, setListBuses] = useState<typeof FAKE_LIST_BUSES>([])
    const [currentBuse, setCurrentBuse] = useState<any>(false)
    const [isVisible, setIsVisible] = useState(false)

    const getListBuses = useCallback(() => {
        setListBuses(FAKE_LIST_BUSES)
    }, [])

    useEffect(() => {
        getListBuses()
    }, [isFocused])

    const renderUser = useCallback(() => {
        return (
            <View style={styles.rowHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FastImage source={images.logout} style={{ width: 14, height: 14 }} tintColor={'#FFF'} />
                </TouchableOpacity>
                <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 12 }}>
                    {`${user.maKh} (${user.tenKh})`}
                </Text>
            </View>
        )
    }, [user])

    const renderBuses = useCallback(({ item, index }: any) => {
        const rows = []
        for (const key in objmap) {
            if (!objmap[key]) continue
            rows.push(
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }} key={key}>
                    <Text>
                        {objmap[key] + ': '}
                    </Text>
                    <Text>
                        {item[key]}
                    </Text>
                </View>
            )
        }
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
            </View>
        )
    }, [])

    const onCancel = useCallback(() => {
        setCurrentBuse(false)
        setTimeout(() => setIsVisible(false), 50)
    }, [])

    const addBuse = useCallback(async (buse: any) => {
        const tmp = [...listBuses]
        let maxId = 0
        for (const element of tmp) {
            if (element.iD_Tang_VT > maxId) maxId = element.iD_Tang_VT
        }
        tmp.push({ ...buse, iD_Tang_VT: maxId + 1 })
        setListBuses(tmp)
        const channelId = await notifee.createChannel({
            id: String(maxId),
            name: 'Default Channel'
        })
        await notifee.displayNotification({
            title: 'Đã thêm chuyến đi',
            body: 'Đã thêm thông tin cho chuyến đi #' + (maxId + 1),
            android: {
                channelId,
                // smallIcon: 'ic_stat_name',
                localOnly: true,
                pressAction: {
                    id: String(buse.iD_Tang_VT),
                    launchActivity: 'default'
                },
            },
            data: {
                type: 'add'
            }
        })

    }, [listBuses])

    const updateBuse = useCallback(async (buse: any) => {
        let tmp = [...listBuses]
        const index = tmp.findIndex(it => it.iD_Tang_VT == buse.iD_Tang_VT)
        tmp[index] = buse
        setListBuses(tmp)
        const channelId = await notifee.createChannel({
            id: String(buse.iD_Tang_VT),
            name: 'Default Channel'
        })
        await notifee.displayNotification({
            title: 'Đã sửa chuyến đi',
            body: 'Đã cập nhật thông tin cho chuyến đi #' + buse.iD_Tang_VT,
            android: {
                channelId,
                // smallIcon: 'ic_stat_name',
                localOnly: true,
                pressAction: {
                    id: String(buse.iD_Tang_VT),
                    launchActivity: 'default'
                },
            },
            data: {
                type: 'update'
            }
        })
    }, [listBuses])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {renderUser()}
            <FlatList
                data={listBuses}
                renderItem={renderBuses}
                keyExtractor={(item: any, index) => item.iD_Tang_VT}
                ListFooterComponent={() => <View style={{ height: 200 }} />}
            />
            {isVisible &&
                <ModalAdd
                    modalVisisble={isVisible}
                    onCancel={onCancel}
                    addBuse={addBuse}
                    updateBuse={updateBuse}
                    currentBuse={currentBuse}
                />}
            <TouchableOpacity
                style={{ position: 'absolute', right: 60, bottom: 60 }}
                onPress={() => setIsVisible(true)}>
                <FastImage style={{ width: 50, height: 50 }} source={images.plus} tintColor={colors.mainBtn} />
            </TouchableOpacity>
        </SafeAreaView>
    )
})

const ModalAdd = React.memo(({ modalVisisble, onCancel, addBuse, updateBuse, currentBuse }: any) => {

    const [isVisible, setIsVisible] = useState(modalVisisble)

    const currentDate = new Date();
    const maxDate = new Date(new Date().getTime() + 30 * 86400 * 1000)

    const [visibleDate, setVisisbleDate] = useState(false)
    const [date, setDate] = useState(currentDate)
    const [startPointId, setStartPointId] = useState(currentBuse ? currentBuse.diem_Di : String(LIST_POSISTION[0].idTangDiemNhanGiao))
    const [endPointId, setEndPointId] = useState(currentBuse ? currentBuse.diem_Nhan : String(LIST_POSISTION[0].idTangDiemNhanGiao))
    const [supId, setSupId] = useState(currentBuse ? currentBuse.khach_Hang : String(FAKE_USER[0].idTangKhNcc))

    const cancelModal = useCallback(() => {
        onCancel()
    }, [onCancel])

    const confirm = useCallback(() => {
        if (!currentBuse) {
            addBuse({
                'gio_Dat_Xe': date.toLocaleDateString('en-GB'),
                'ten_Dia_Diem_DI': LIST_POSISTION.find(it => it.idTangDiemNhanGiao == Number(startPointId))?.tenDiaDiem,
                'ten_Dia_Diem_Nhan': LIST_POSISTION.find(it => it.idTangDiemNhanGiao == Number(endPointId))?.tenDiaDiem,
                'ma_KH': FAKE_USER.find(it => it.idTangKhNcc == Number(supId))?.maKh,
                'ten_KH': FAKE_USER.find(it => it.idTangKhNcc == Number(supId))?.tenKh,
                'diem_Di': Number(startPointId),
                "diem_Nhan": Number(endPointId),
                "khach_Hang": Number(supId),
            })
        }
        else {
            updateBuse({
                'iD_Tang_VT': currentBuse.iD_Tang_VT,
                'gio_Dat_Xe': date.toLocaleDateString('en-GB'),
                'ten_Dia_Diem_DI': LIST_POSISTION.find(it => it.idTangDiemNhanGiao == Number(startPointId))?.tenDiaDiem,
                'ten_Dia_Diem_Nhan': LIST_POSISTION.find(it => it.idTangDiemNhanGiao == Number(endPointId))?.tenDiaDiem,
                'ma_KH': FAKE_USER.find(it => it.idTangKhNcc == Number(supId))?.maKh,
                'ten_KH': FAKE_USER.find(it => it.idTangKhNcc == Number(supId))?.tenKh,
                'diem_Di': Number(startPointId),
                "diem_Nhan": Number(endPointId),
                "khach_Hang": Number(supId),
            })
        }
        onCancel()
    }, [onCancel, addBuse, currentBuse,
        startPointId, endPointId,
        supId])

    const handleDatePicked = useCallback((dateChoose: Date) => {
        setDate(dateChoose)
        setVisisbleDate(false)
    }, [])

    return (
        <Modal
            // animationIn={"fadeIn"}
            // animationOut={"fadeOut"}
            isVisible={isVisible}
            style={{ width: dimensions.widthScreen, height: dimensions.heightScreen, margin: 0 }}
        >
            <TouchableOpacity
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                onPress={cancelModal}
                activeOpacity={1}
            >
                <TouchableOpacity style={styles.modalView} activeOpacity={1} onPress={(() => { })}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, margin: 5 }}>
                        {!currentBuse ? "Thêm chuyến đi" : 'Sửa chuyến đi'}
                    </Text>
                    <View style={{ width: '100%', height: 1, backgroundColor: 'gray', opacity: 0.5, marginBottom: 5 }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text>{"Ngày tháng"}</Text>
                        <TouchableOpacity
                            style={styles.dropdown}
                            onPress={() => setVisisbleDate(true)}>
                            <Text>{date.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ width: 100 }}>{"Điểm đi"}</Text>
                        <View style={[styles.dropdown, { backgroundColor: 'transparent', flex: 1 }]}>
                            <Select
                                width={'100%'}
                                height={30}
                                //@ts-ignore
                                style={{ textAlign: 'right', color: 'black' }}
                                _selectedItem={{
                                    endIcon: <CheckIcon size="1" style={{ marginTop: 3 }} />,
                                }}
                                selectedValue={String(startPointId)}
                                onValueChange={(value) => setStartPointId(value)}
                            >
                                {
                                    LIST_POSISTION.map((item, index) => (
                                        <Select.Item value={String(item.idTangDiemNhanGiao)} label={item.tenDiaDiem} key={item.idTangDiemNhanGiao} />
                                    ))
                                }
                            </Select>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ width: 100 }}>{"Điểm đến"}</Text>
                        <View style={[styles.dropdown, { backgroundColor: 'transparent', flex: 1 }]}>
                            <Select
                                width={'100%'}
                                height={30}
                                //@ts-ignore
                                style={{ textAlign: 'right', color: 'black' }}
                                _selectedItem={{
                                    endIcon: <CheckIcon size="1" style={{ marginTop: 3 }} />,
                                }}
                                selectedValue={String(endPointId)}
                                onValueChange={(value) => setEndPointId(value)}
                            >
                                {
                                    LIST_POSISTION.map((item, index) => (
                                        <Select.Item value={String(item.idTangDiemNhanGiao)} label={item.tenDiaDiem} key={item.idTangDiemNhanGiao} />
                                    ))
                                }
                            </Select>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ width: 100 }}>{"Chọn Khách hàng"}</Text>
                        <View style={[styles.dropdown, { backgroundColor: 'transparent', flex: 1 }]}>
                            <Select
                                width={'100%'}
                                height={30}
                                //@ts-ignore
                                style={{ textAlign: 'right', color: 'black' }}
                                _selectedItem={{
                                    endIcon: <CheckIcon size="1" style={{ marginTop: 3 }} />,
                                }}
                                selectedValue={String(supId)}
                                onValueChange={(value) => setSupId(value)}
                            >
                                {
                                    FAKE_USER.map((item, index) => (
                                        <Select.Item value={String(item.idTangKhNcc)} label={item.tenKh} key={item.idTangKhNcc} />
                                    ))
                                }
                            </Select>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
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
                    <DateTimePicker
                        date={currentDate}
                        maximumDate={maxDate}
                        isVisible={visibleDate}
                        onConfirm={handleDatePicked}
                        onCancel={() => setVisisbleDate(false)}
                        mode={"date"}
                        locale="vi-VN"
                    />
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
    modalView: {
        margin: 30, width: dimensions.widthScreen - 60,
        borderRadius: 10, backgroundColor: 'white',
        padding: 10
    },
    dropdown: { padding: 5, borderRadius: 5, backgroundColor: colors.item_bg, marginVertical: 5 },
    btn: {
        width: 100, height: 30, justifyContent: 'center', alignItems: 'center',
        borderRadius: 5,
        marginTop: 10
    }
})