import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { AuthStackParamList, NavigationUtils } from "@navigation";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch } from "react-redux";
import { updateToken } from "@redux";

export interface LoginScreenParams {

}

type NavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const FAKE_USER = [
    {
        "id": 1,
        "maKh": "MinhTiep",
        "tenKh": "Công ty TNHH Minh Tiệp",
        "loaiKhach": 'manager'
    },
    {
        "id": 2,
        "maKh": "MinhHieu",
        "tenKh": "Công ty vận tải Minh Hiếu",
        "loaiKhach": 'driver'
    }
]


export const LoginScreen = React.memo(() => {

    const navigation = useNavigation<NavigationProp>();
    const dispacth = useDispatch()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = useCallback(async () => {

        const customer = FAKE_USER.find(it => it.maKh.toUpperCase() == username.toUpperCase())
        if (!customer) return Alert.alert('Không tồn tại khách hàng này!')
        dispacth(updateToken(customer))
        NavigationUtils.resetGlobalStackWithScreen(navigation, 'Home');
    }, [username, password, navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{"Đăng nhập"}</Text>
            <TextInput
                style={styles.input}
                placeholder="Mã khách hàng"
                value={username}
                onChangeText={text => setUsername(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                secureTextEntry
                value={password}
                onChangeText={text => setPassword(text)}
            />
            <Button title="Đăng nhập" onPress={handleLogin} />
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 10,
    },
    signupText: {
        marginTop: 16,
        textAlign: 'center',
    },
    signupLink: {
        color: 'blue',
        fontWeight: 'bold',
    },
});