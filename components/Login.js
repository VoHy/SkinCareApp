// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const Login = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post('https://your-api-url.com/api/login', {
//         email,
//         password
//       });

//       if (response.data.token) {
//         await AsyncStorage.setItem('token', response.data.token);
//         Alert.alert('Đăng nhập thành công');
//         navigation.navigate('Home'); // Chuyển hướng sau khi đăng nhập thành công
//       } else {
//         Alert.alert('Đăng nhập thất bại', 'Vui lòng kiểm tra lại thông tin');
//       }
//     } catch (error) {
//       Alert.alert('Lỗi', 'Đăng nhập không thành công');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Đăng nhập</Text>
//       <TextInput 
//         style={styles.input} 
//         placeholder="Email" 
//         value={email} 
//         onChangeText={setEmail} 
//         keyboardType="email-address"
//       />
//       <TextInput 
//         style={styles.input} 
//         placeholder="Mật khẩu" 
//         value={password} 
//         onChangeText={setPassword} 
//         secureTextEntry 
//       />
//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>Đăng nhập</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 15,
//   },
//   button: {
//     backgroundColor: '#007BFF',
//     padding: 15,
//     borderRadius: 8,
//     width: '100%',
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });

// export default Login;
