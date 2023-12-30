import React from 'react';
import { ActivityIndicator, StatusBar, View, Text } from 'react-native';
import reduxConfig from './src/redux/config-store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { RootNavigation } from '@navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import { colors } from '@common';
import { NativeBaseProvider, Box } from "native-base";

import { createServer } from "miragejs"

declare global {
  interface Window {
    server: any;
  }
}
interface IState {
  isLoading: boolean,
  store: any
}

interface IProps { }
class App extends React.PureComponent<IProps, IState> {
  constructor(props: IProps | Readonly<IProps>) {
    super(props)
    this.state = {
      isLoading: true,
      store: reduxConfig(async () => {
        console.log('STORE is setup successfully! :::::::', this.state.store);
        this.setState({ isLoading: false })
      }),
    };
  }

  componentDidMount(): void {
    if (window.server) {
      window.server.shutdown()
    }

    window.server = createServer({
      routes() {

        this.namespace = '';

        this.get("/api/NHA_CUNG_CAP_VÀ_XE_CONG_TY", () => {
          return {
            data: [
              {
                "nha_CC_ID": 2003,
                "ma_Nha_CC": "An Trang",
                "bien_Xe_ID": 0
              },
              {
                "nha_CC_ID": 2,
                "ma_Nha_CC": "Mai Thị - Phú An 1 / BHK3134",
                "bien_Xe_ID": 1
              },
              {
                "nha_CC_ID": 2,
                "ma_Nha_CC": "Vũ Mai - Phú An 2 / BJH2456",
                "bien_Xe_ID": 2
              },
              {
                "nha_CC_ID": 2,
                "ma_Nha_CC": "Vũ Mai - Phú An 3 / BNH4578",
                "bien_Xe_ID": 3
              }
            ]
          }
        });

        this.get('/api/BIEN_XE', () => {
          return {
            data: [
              {
                "idTangBienXe": 1,
                "bienXe": "BHK3134",
                "maXe": "Phú An 1",
                "nha_CC_ID": 2
              },
              {
                "idTangBienXe": 2,
                "bienXe": "BJH2456",
                "maXe": "Phú An 2",
                "nha_CC_ID": 2
              },
              {
                "idTangBienXe": 3,
                "bienXe": "BNH4578",
                "maXe": "Phú An 3",
                "nha_CC_ID": 2
              },
              {
                "idTangBienXe": 4,
                "bienXe": "KJH48759",
                "maXe": "Phú An 4",
                "nha_CC_ID": 2003
              },
              {
                "idTangBienXe": 5,
                "bienXe": "KLJ45787",
                "maXe": null,
                "nha_CC_ID": 2003
              },
              {
                "idTangBienXe": 6,
                "bienXe": "KJU45798",
                "maXe": null,
                "nha_CC_ID": 2003
              }
            ]
          }
        });

        this.get('/api/KHACH_HANG_VA_NHA_CUNG_CAP', () => {
          return {
            data: [
              {
                "idTangKhNcc": 1,
                "maKh": "Haid",
                "tenKh": "Công ty TNHH Haid",
                "diaChi": null,
                "loaiKhach": 1
              },
              {
                "idTangKhNcc": 2,
                "maKh": "Phú An",
                "tenKh": "Công ty TNHH Dịch Vụ Khoa Bãi Phú An",
                "diaChi": "Thành Phố Hải Phòng",
                "loaiKhach": 2
              },
              {
                "idTangKhNcc": 2003,
                "maKh": "An Trang",
                "tenKh": "Công ty TNHH Thương Mại và Dịch Vụ An Trang",
                "diaChi": "Thành Phố Hải Phòng",
                "loaiKhach": 2
              },
              {
                "idTangKhNcc": 2004,
                "maKh": "Đạt Phát",
                "tenKh": "Công ty TNHH TM && DV Đạt Phát",
                "diaChi": "Hà Nội",
                "loaiKhach": 1
              },
              {
                "idTangKhNcc": 2005,
                "maKh": "Khánh An",
                "tenKh": "Công ty TNHH TM&DV Khánh An",
                "diaChi": "Bắc Ninh",
                "loaiKhach": 1
              }
            ]
          }
        });

        this.get('/api/DIA_DIEM_NHAN_VA_DI', () => {
          return {
            data: [
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
          }
        });

        this.get("/api/VAN_TAI_DIEU_XE", () => {
          return {
            data: [
              {
                "iD_Tang_VT": 1,
                "bien_Xe": 1,
                "ma_Xe": "Phú An 1",
                "bien_So_Xe": "BHK3134 Phú An 1",
                "cuoc_Thu": null,
                "cuoc_Tra": null,
                "diem_Di": 1,
                "ten_Dia_Diem_DI": "Hà Nội",
                "diem_Nhan": 2,
                "ten_Dia_Diem_Nhan": "Hà Nội",
                "ghi_Chu": null,
                "giao_nop_BB": null,
                "gio_Dat_Xe": null,
                "ma_KH": "Haid",
                "khach_Hang": 1,
                "ten_KH": "Công ty TNHH Haid",
                "loai_KH": 1,
                "nha_CC": 2,
                "ma_Nha_CC": "Vũ Mai - Phú An 3 / BNH4578",
                "ngay_Chay": "2023-12-24T00:00:00",
                "nha_CC_Chot": null,
                "phe_Duyet": 0,
                "pS_Chi": null,
                "pS_Thu": null,
                "so_seal_Chi": null,
                "trong_Tai": 20
              }
            ]
          }
        });

        this.get('/api/LAI_XE_NHAN_CHUYEN', () => {
          return {
            data: [
              {
                "iD_Tang_VT": 1,
                "bien_Xe": 2,
                "ma_Xe": "Phú An 2",
                "bien_So_Xe": "BJH2456 Phú An 2",
                "cuoc_Thu": 0,
                "cuoc_Tra": 0,
                "diem_Di": 1,
                "ten_Dia_Diem_DI": "Hà Nội",
                "diem_Nhan": 1,
                "ten_Dia_Diem_Nhan": "Hà Nội",
                "ghi_Chu": null,
                "giao_nop_BB": 0,
                "gio_Dat_Xe": null,
                "ma_KH": "Haid",
                "khach_Hang": 1,
                "ten_KH": "Công ty TNHH Haid",
                "loai_KH": 1,
                "nha_CC": 2,
                "ma_Nha_CC": "Phú An",
                "ngay_Chay": "2023-12-24T00:00:00",
                "nha_CC_Chot": 0,
                "phe_Duyet": 1,
                "pS_Chi": 0,
                "pS_Thu": 0,
                "so_seal_Chi": null,
                "trong_Tai": 10,
                "de_Nghi_TT_ID": null
              },
              {
                "iD_Tang_VT": 2,
                "bien_Xe": 1,
                "ma_Xe": "Phú An 1",
                "bien_So_Xe": "BHK3134 Phú An 1",
                "cuoc_Thu": 0,
                "cuoc_Tra": 0,
                "diem_Di": 1,
                "ten_Dia_Diem_DI": "Hà Nội",
                "diem_Nhan": 1,
                "ten_Dia_Diem_Nhan": "Hà Nội",
                "ghi_Chu": null,
                "giao_nop_BB": 0,
                "gio_Dat_Xe": null,
                "ma_KH": "Haid",
                "khach_Hang": 1,
                "ten_KH": "Công ty TNHH Haid",
                "loai_KH": 2,
                "nha_CC": 2,
                "ma_Nha_CC": "Phú An",
                "ngay_Chay": "2023-12-24T00:00:00",
                "nha_CC_Chot": 0,
                "phe_Duyet": 1,
                "pS_Chi": 0,
                "pS_Thu": 0,
                "so_seal_Chi": null,
                "trong_Tai": 1,
                "de_Nghi_TT_ID": null
              }
            ]
          }
        });

        this.get('/api/PHI_PHAT_SINH', () => {
          return {
            data: [
              {
                "iD_Tang_Phi": 1,
                "hd": null,
                "noi_Dung_Phi": "Thêm điểm ",
                "trang_Thai": null
              },
              {
                "iD_Tang_Phi": 2,
                "hd": null,
                "noi_Dung_Phi": "2 Chiều",
                "trang_Thai": null
              },
              {
                "iD_Tang_Phi": 3,
                "hd": null,
                "noi_Dung_Phi": "Kiểm hoá",
                "trang_Thai": null
              },
              {
                "iD_Tang_Phi": 4,
                "hd": null,
                "noi_Dung_Phi": "Tăng cường",
                "trang_Thai": null
              },
              {
                "iD_Tang_Phi": 5,
                "hd": null,
                "noi_Dung_Phi": "Lưu đêm",
                "trang_Thai": null
              },
              {
                "iD_Tang_Phi": 6,
                "hd": null,
                "noi_Dung_Phi": "Lưu ngày",
                "trang_Thai": null
              },
              {
                "iD_Tang_Phi": 7,
                "hd": null,
                "noi_Dung_Phi": "Chị hộ khách",
                "trang_Thai": null
              },
              {
                "iD_Tang_Phi": 8,
                "hd": null,
                "noi_Dung_Phi": "Thuê người bốc xếp",
                "trang_Thai": null
              },
              {
                "iD_Tang_Phi": 9,
                "hd": null,
                "noi_Dung_Phi": "Hải quan",
                "trang_Thai": null
              },
              {
                "iD_Tang_Phi": 10,
                "hd": null,
                "noi_Dung_Phi": "Trả tiền hộ khách",
                "trang_Thai": null
              },
              {
                "iD_Tang_Phi": 11,
                "hd": null,
                "noi_Dung_Phi": "Vé xe phát sinh",
                "trang_Thai": null
              },
              {
                "iD_Tang_Phi": 12,
                "hd": null,
                "noi_Dung_Phi": "Tiền luật",
                "trang_Thai": null
              }
            ]
          }
        })
      }
    })

  }

  render() {
    const { isLoading, store } = this.state;
    if (isLoading) {
      return (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              // flexDirection: 'row',
              backgroundColor: 'white',
              minHeight: 100,
              minWidth: 100,
              borderRadius: 8,
              padding: 16
            }}>
            <ActivityIndicator size="large" color={colors.mainBtn} />
            <Text style={{ fontWeight: 'bold', color: colors.mainBtn, marginTop: 12 }}>{"Đang đồng bộ dữ liệu"}</Text>
          </View>
        </View>
      );
    }
    return (
      <NativeBaseProvider>
        <Box flex={1}>
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
              <StatusBar translucent={false} barStyle={'light-content'} />
              <Provider store={store.store}>
                <PersistGate
                  // loading={<SplashScreen/>}
                  persistor={store.persistor}>
                  <RootNavigation />
                </PersistGate>
              </Provider>
            </SafeAreaView>
          </SafeAreaProvider>
        </Box>
      </NativeBaseProvider>
    );
  }
}

export default App


