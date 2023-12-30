import React, { useCallback, useEffect, useState } from "react";
import { colors, dimensions, images } from "@common";
import { HomeStackParamList, NavigationUtils } from "@navigation";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import SafeAreaView from "react-native-safe-area-view";
import { useSelector } from "react-redux";
import FastImage from 'react-native-fast-image'
import Modal from "react-native-modal";
import DateTimePicker from "react-native-modal-datetime-picker";
import { displayLocalNotification, formatMoney } from "@utils";
import { MyInput, SelectBtmSheet } from "@components";
import { objmap } from "./mapping";

export interface CarControlParams { }

type NavigationProp = StackNavigationProp<HomeStackParamList, 'CarControl'>;

export const CarControl = React.memo(() => {

    const navigation = useNavigation<NavigationProp>();
    const isFocused = useIsFocused()
    const user = useSelector((state: any) => state.authReducer)

    const [fetched, setFetched] = useState(false)

    const [listBuses, setListBuses] = useState<any>([])
    const [listPositon, setListPosition] = useState<any>([])
    const [listSupply, setListSupply] = useState<any>([])
    const [listCustomer, setListCustomer] = useState<any>([])
    const [listCar, setListCar] = useState<any>([])

    const [currentBuse, setCurrentBuse] = useState<any>(false)
    const [isVisible, setIsVisible] = useState(false)

    const getInitData = useCallback(async () => {

        await fetch("/api/VAN_TAI_DIEU_XE")
            .then((res) => res.json())
            .then((json) => setListBuses(json.data))

        await fetch("/api/DIA_DIEM_NHAN_VA_DI")
            .then((res) => res.json())
            .then((json) => setListPosition(json.data))

        await fetch("/api/KHACH_HANG_VA_NHA_CUNG_CAP")
            .then((res) => res.json())
            .then((json: any) => {
                const supply = []
                const customer = []
                for (const element of json.data) {
                    if (element.loaiKhach == 1) customer.push(element)
                    if (element.loaiKhach == 2) supply.push(element)
                }
                // setListSupply(supply)
                setListCustomer(customer)
            })

        await fetch('/api/NHA_CUNG_CAP_VÀ_XE_CONG_TY')
            .then((res) => res.json())
            .then((json: any) => {
                setListSupply(json.data)
            })


        await fetch("/api/BIEN_XE")
            .then((res) => res.json())
            .then((json) => setListCar(json.data))

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

    const sendToDriver = useCallback((buse: any) => {
        Alert.alert(
            'Gửi lái xe',
            'Gửi chuyến xe đến tài xế',
            [
                {
                    text: 'Huỷ',
                    onPress: () => Alert.alert('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Xác nhận',
                    onPress: () => {
                        let newBuse = { ...buse }
                        newBuse.phe_Duyet = 1
                        updateBuse(newBuse, true)
                    },
                    style: 'default',
                },
            ],
            {
                cancelable: true,
                onDismiss: () => { }
            },
        );
    }, [listBuses])

    const renderSpecialKey = useCallback((key: string, value: string | number) => {
        if (key == 'ngay_Chay') return new Date(value).toLocaleDateString('vi')
        if (key == 'trong_Tai' || key == 'cuoc_Thu' || key == 'cuoc_Chi') return formatMoney(Number(value))
        return value
    }, [])

    const renderBuses = useCallback(({ item, index }: any) => {

        if (item.phe_Duyet) return <></>
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4, alignItems: 'center' }}>
                    <Text>
                        {'Trạng thái' + ': '}
                    </Text>
                    <View style={{ flex: 1 }} />
                    <Text style={{ color: 'orange' }}>
                        {"Chưa điều xe"}
                    </Text>
                    <TouchableOpacity
                        style={{ padding: 5, borderRadius: 5, backgroundColor: colors.mainBtn, marginLeft: 10 }}
                        onPress={() => sendToDriver(item)}>
                        <Text style={{ color: 'white' }}>{"Gửi lái xe"}</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }, [listBuses])

    const onCancel = useCallback(() => {
        setIsVisible(false)
        setTimeout(() => setCurrentBuse(false), 50)
    }, [])

    const addBuse = useCallback(async (buse: any) => {
        const tmp = [...listBuses]
        let maxId = 0
        for (const element of tmp) {
            if (element.iD_Tang_VT > maxId) maxId = element.iD_Tang_VT
        }
        tmp.push({ ...buse, iD_Tang_VT: maxId + 1 })
        setListBuses(tmp)
        // Call api addbuse o day
        displayLocalNotification({
            title: 'Đã thêm chuyến đi',
            body: 'Đã thêm thông tin cho chuyến đi #' + (maxId + 1),
            messageId: maxId + 1,
            dataType: 'add'
        })
    }, [listBuses])

    const updateBuse = useCallback(async (buse: any, send?: boolean) => {
        let tmp = [...listBuses]
        const index = tmp.findIndex(it => it.iD_Tang_VT == buse.iD_Tang_VT)
        tmp[index] = buse
        setListBuses(tmp)
        if (send) {
            displayLocalNotification({
                title: 'Đã gửi chuyến đi',
                body: 'Đã gửi chuyến đi #' + buse.iD_Tang_VT + " đến tài xế",
                messageId: buse.iD_Tang_VT,
                dataType: 'update'
            })
        }
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
            {fetched && isVisible &&
                <ModalAdd
                    modalVisisble={isVisible}
                    onCancel={onCancel}
                    addBuse={addBuse}
                    updateBuse={updateBuse}
                    currentBuse={currentBuse}
                    LIST_POSISTION={listPositon}
                    LIST_SUPPLY={listSupply}
                    LIST_CUSTOMER={listCustomer}
                    LIST_CAR={listCar}
                />
            }
            <TouchableOpacity
                style={{ position: 'absolute', right: 60, bottom: 60 }}
                onPress={() => setIsVisible(true)}>
                <FastImage style={{ width: 50, height: 50 }} source={images.plus} tintColor={colors.mainBtn} />
            </TouchableOpacity>
        </SafeAreaView>
    )
})

interface ModalProps {
    modalVisisble: boolean,
    onCancel: () => void,
    addBuse: (buse: any) => void,
    updateBuse: (buse: any) => void,
    currentBuse: any,
    LIST_POSISTION: any[],
    LIST_SUPPLY: any[],
    LIST_CUSTOMER: any[],
    LIST_CAR: any[]
}
const ModalAdd = React.memo(({
    modalVisisble,
    currentBuse,
    onCancel,
    addBuse,
    updateBuse,
    LIST_POSISTION,
    LIST_SUPPLY,
    LIST_CUSTOMER,
    LIST_CAR }: ModalProps) => {

    const currentDate = new Date();
    const maxDate = new Date(new Date().getTime() + 30 * 86400 * 1000)

    const [visibleDate, setVisisbleDate] = useState(false)
    const [date, setDate] = useState(currentBuse && currentBuse.ngay_Chay ? new Date(currentBuse.ngay_Chay) : currentDate)
    const [startPointId, setStartPointId] = useState(currentBuse ? currentBuse.diem_Di : String(LIST_POSISTION[0].idTangDiemNhanGiao))
    const [endPointId, setEndPointId] = useState(currentBuse ? currentBuse.diem_Nhan : String(LIST_POSISTION[0].idTangDiemNhanGiao))
    const [customerId, setCustomerId] = useState(currentBuse ? currentBuse.khach_Hang : String(LIST_CUSTOMER[0].idTangKhNcc))
    const [supplyId, setSupplyId] = useState(currentBuse ? currentBuse.ma_Nha_CC : String(LIST_SUPPLY[0].ma_Nha_CC))

    const [listChooseCar, setListChooseCar] = useState<any[]>([])
    useEffect(() => {
        const car = supplyId.split('-')
        setCarCode(car[0])
        setCarSign(car[1])
    }, [supplyId, LIST_CAR])

    const [carId, setCarId] = useState<any>('')
    const [carCode, setCarCode] = useState(currentBuse && currentBuse.ma_Xe ? currentBuse.ma_Xe : 'Chưa chọn xe')
    const [carSign, setCarSign] = useState(currentBuse && currentBuse.bien_So_Xe ? currentBuse.bien_So_Xe : 'Chưa chọn xe')

    const onChangeCar = useCallback((id: string | number) => {
        console.log(id)
        setCarId(id)
        const car = listChooseCar.find(it => it.ma_Nha_CC == id)
        setCarCode(car.maXe)
        setCarSign(car.bienXe)
    }, [listChooseCar])

    const [payload, setPlayload] = useState(currentBuse && currentBuse.trong_Tai ? currentBuse.trong_Tai : 0)
    const [collectfee, setCollectfee] = useState(currentBuse && currentBuse.cuoc_Thu ? currentBuse.cuoc_Thu : 0)
    const [cost, setCost] = useState(currentBuse && currentBuse.cuoc_Chi ? currentBuse.cuoc_Chi : 0)
    const [seal, setSeal] = useState(currentBuse && currentBuse.so_seal_Chi ? currentBuse.so_seal_Chi : '')

    const cancelModal = useCallback(() => {
        onCancel()
    }, [onCancel])

    const confirm = useCallback(() => {
        if (!currentBuse) {
            addBuse({
                ...currentBuse,
                'ngay_Chay': date,
                'ten_Dia_Diem_DI': LIST_POSISTION.find(it => it.idTangDiemNhanGiao == Number(startPointId))?.tenDiaDiem,
                'ten_Dia_Diem_Nhan': LIST_POSISTION.find(it => it.idTangDiemNhanGiao == Number(endPointId))?.tenDiaDiem,
                'ma_KH': LIST_CUSTOMER.find(it => it.idTangKhNcc == Number(customerId))?.maKh,
                'ten_KH': LIST_CUSTOMER.find(it => it.idTangKhNcc == Number(customerId))?.tenKh,
                'diem_Di': Number(startPointId),
                "diem_Nhan": Number(endPointId),
                "khach_Hang": Number(customerId),
                "ma_Nha_CC": supplyId,
                'trong_Tai': Number(payload),
                'cuoc_Thu': Number(collectfee),
                'cuoc_Chi': Number(cost),
                'so_seal_Chi': String(seal),
            })
        }
        else {
            updateBuse({
                ...currentBuse,
                'iD_Tang_VT': currentBuse.iD_Tang_VT,
                'ngay_Chay': date,
                'ten_Dia_Diem_DI': LIST_POSISTION.find(it => it.idTangDiemNhanGiao == Number(startPointId))?.tenDiaDiem,
                'ten_Dia_Diem_Nhan': LIST_POSISTION.find(it => it.idTangDiemNhanGiao == Number(endPointId))?.tenDiaDiem,
                'ma_KH': LIST_CUSTOMER.find(it => it.idTangKhNcc == Number(customerId))?.maKh,
                'ten_KH': LIST_CUSTOMER.find(it => it.idTangKhNcc == Number(customerId))?.tenKh,
                'diem_Di': Number(startPointId),
                "diem_Nhan": Number(endPointId),
                "khach_Hang": Number(customerId),
                "ma_Nha_CC": supplyId,
                'trong_Tai': Number(payload),
                'cuoc_Thu': Number(collectfee),
                'cuoc_Chi': Number(cost),
                'so_seal_Chi': String(seal),
            })
        }
        onCancel()
    }, [onCancel, addBuse, updateBuse,
        currentBuse,
        startPointId, endPointId,
        customerId, supplyId,
        payload, collectfee, cost, seal, date])

    const handleDatePicked = useCallback((dateChoose: Date) => {
        setDate(dateChoose)
        setVisisbleDate(false)
    }, [])

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
                        {!currentBuse ? "Thêm chuyến đi" : 'Sửa chuyến đi'}
                    </Text>
                    <View style={{ width: '100%', height: 1, backgroundColor: 'gray', opacity: 0.5, marginBottom: 5 }} />
                    <ScrollView>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text>{"Ngày tháng"}</Text>
                            <TouchableOpacity
                                style={styles.dropdown}
                                onPress={() => setVisisbleDate(true)}>
                                <Text>{date.toLocaleDateString('vi')}</Text>
                            </TouchableOpacity>
                        </View>
                        <SelectBtmSheet
                            title={"Điểm đi"}
                            selectedValue={startPointId}
                            onValueChange={setStartPointId}
                            listChoose={LIST_POSISTION}
                            keyValue={'idTangDiemNhanGiao'}
                            keyLabel={'tenDiaDiem'}
                        />
                        <SelectBtmSheet
                            title={"Điểm đến"}
                            selectedValue={endPointId}
                            onValueChange={setEndPointId}
                            listChoose={LIST_POSISTION}
                            keyValue={'idTangDiemNhanGiao'}
                            keyLabel={'tenDiaDiem'}
                        />
                        <SelectBtmSheet
                            title={"Chọn khách hàng"}
                            selectedValue={customerId}
                            onValueChange={setCustomerId}
                            listChoose={LIST_CUSTOMER}
                            keyValue={'idTangKhNcc'}
                            keyLabel={'tenKh'}
                        />
                        <SelectBtmSheet
                            title={"Chọn nhà cung cấp"}
                            selectedValue={supplyId}
                            onValueChange={setSupplyId}
                            listChoose={LIST_SUPPLY}
                            keyValue={'ma_Nha_CC'}
                            keyLabel={'ma_Nha_CC'}
                        />
                        {listChooseCar.length > 0 &&
                            <SelectBtmSheet
                                title={"Chọn xe"}
                                selectedValue={carId}
                                onValueChange={onChangeCar}
                                listChoose={listChooseCar}
                                keyValue={'idTangBienXe'}
                                keyLabel={['maXe', 'bienXe']}
                            />
                        }
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text>{`Mã xe: ${carCode}`}</Text>
                            <Text>{`Biển xe: ${carSign || 'Không có thông tin'}`}</Text>
                        </View>
                        <MyInput
                            title={"Trọng tải"}
                            placeholder={0}
                            value={payload}
                            onChangeValue={setPlayload}
                            keyboardType={"numeric"}
                        />
                        <MyInput
                            title={"Cước thu"}
                            placeholder={0}
                            value={collectfee}
                            onChangeValue={setCollectfee}
                            keyboardType={"numeric"}
                        />
                        <MyInput
                            title={"Cước chi"}
                            placeholder={0}
                            value={cost}
                            onChangeValue={setCost}
                            keyboardType={"numeric"}
                        />
                        <MyInput
                            title={"Số seal chi"}
                            placeholder={'Nhập số seal chi'}
                            value={seal}
                            onChangeValue={setSeal}
                        />
                    </ScrollView>

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
                    <DateTimePicker
                        date={date}
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
        margin: 10, width: dimensions.widthScreen - 20,
        flex: 1,
        borderRadius: 10, backgroundColor: 'white',
        padding: 10
    },
    dropdown: { padding: 5, borderRadius: 5, backgroundColor: colors.item_bg, marginVertical: 5 },
    btn: {
        width: 100, height: 30, justifyContent: 'center', alignItems: 'center',
        borderRadius: 5,
        marginTop: 10, marginHorizontal: 10
    }
})