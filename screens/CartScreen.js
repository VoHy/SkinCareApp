import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function CartScreen() {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        loadCart();
    }, []);

    // Tải dữ liệu giỏ hàng từ AsyncStorage
    const loadCart = async () => {
        try {
            const storedCart = await AsyncStorage.getItem('cart');
            setCart(storedCart ? JSON.parse(storedCart) : []);
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    };

    // Cập nhật giỏ hàng trong AsyncStorage
    const updateCart = async (updatedCart) => {
        try {
            await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
            setCart(updatedCart);
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    // Tăng số lượng sản phẩm
    const increaseQuantity = (id) => {
        const updatedCart = cart.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        updateCart(updatedCart);
    };

    // Giảm số lượng sản phẩm (xóa nếu số lượng = 1)
    const decreaseQuantity = (id) => {
        const updatedCart = cart.map(item =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        ).filter(item => item.quantity > 0);
        updateCart(updatedCart);
    };

    // Xóa sản phẩm khỏi giỏ hàng
    const removeItem = (id) => {
        Alert.alert("Xác nhận", "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?", [
            { text: "Hủy", style: "cancel" },
            {
                text: "Xóa",
                onPress: () => {
                    const updatedCart = cart.filter(item => item.id !== id);
                    updateCart(updatedCart);
                },
                style: "destructive",
            }
        ]);
    };

    // Tính tổng tiền
    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={cart}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <Image source={item.image} style={styles.image} />
                        <View style={styles.info}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.price}>{item.price}đ</Text>
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
                                    <Icon name="minus-circle" size={24} color="#ff5733" />
                                </TouchableOpacity>
                                <Text style={styles.quantity}>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
                                    <Icon name="plus-circle" size={24} color="#ff5733" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => removeItem(item.id)}>
                            <Icon name="trash" size={24} color="gray" />
                        </TouchableOpacity>
                    </View>
                )}
            />
            <View style={styles.footer}>
                <Text style={styles.total}>Tổng tiền: {calculateTotal()}đ</Text>
                <TouchableOpacity style={styles.checkoutButton}>
                    <Text style={styles.checkoutText}>Thanh toán</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    cartItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8 },
    image: { width: 80, height: 80, borderRadius: 10 },
    info: { flex: 1, marginLeft: 10 },
    name: { fontSize: 16, fontWeight: 'bold' },
    price: { fontSize: 14, color: '#ff5733', marginVertical: 5 },
    quantityContainer: { flexDirection: 'row', alignItems: 'center' },
    quantity: { fontSize: 16, marginHorizontal: 10 },
    footer: { borderTopWidth: 1, borderColor: '#ddd', paddingVertical: 10, alignItems: 'center' },
    total: { fontSize: 18, fontWeight: 'bold' },
    checkoutButton: { backgroundColor: '#ff5733', padding: 12, borderRadius: 8, marginTop: 10 },
    checkoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

