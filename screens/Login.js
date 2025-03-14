import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const fixedEmail = "admin@gmail.com";
    const fixedPassword = "123456";

    const handleLogin = async () => {
        if (email === fixedEmail && password === fixedPassword) {
            await AsyncStorage.setItem('userToken', 'fake-token-123456');
            await AsyncStorage.setItem('isLoggedIn', 'true');
            setIsLoggedIn(true); // <-- Cập nhật trạng thái đăng nhập
            Alert.alert("Thành công", "Đăng nhập thành công!");
            navigation.navigate("Home");
        } else {
            Alert.alert("Lỗi", "Tài khoản hoặc mật khẩu không đúng!");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng nhập</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Đăng nhập</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { width: '80%', height: 50, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 15, paddingLeft: 10 },
    button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, width: '80%', alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
