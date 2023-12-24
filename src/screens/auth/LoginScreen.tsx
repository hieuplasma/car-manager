import React, { useCallback, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
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
        "idTangKhNcc": 1,
        "maKh": "Haid",
        "tenKh": "Công ty TNHH Haid",
        "diaChi": null,
        "loaiKhach": 1
    },
    {
        "idTangKhNcc": 2,
        "maKh": "SS",
        "tenKh": "Server",
        "diaChi": null,
        "loaiKhach": 2
    }
]


export const LoginScreen = React.memo(() => {

    const navigation = useNavigation<NavigationProp>();
    const dispacth = useDispatch()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = useCallback(async () => {

        const customer = FAKE_USER.find(it => it.maKh == username)
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
            <Button title="Login" onPress={handleLogin} />
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