import React, { useState, useCallback } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function CartScreen() {
    const [cart, setCart] = useState([]);

    useFocusEffect(
        useCallback(() => {
            const loadCart = async () => {
                try {
                    const storedCart = await AsyncStorage.getItem("cart");
                    setCart(storedCart ? JSON.parse(storedCart) : []);
                } catch (error) {
                    console.error("Lỗi khi tải giỏ hàng:", error);
                }
            };
            loadCart();
        }, [])
    );



    const removeFromCart = async (id) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        setCart(updatedCart);
        await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Tính tổng tiền
    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Xử lý thanh toán
    const handleCheckout = async () => {
        if (cart.length === 0) {
            Alert.alert("Thông báo", "Giỏ hàng trống, không thể thanh toán!");
            return;
        }

        Alert.alert(
            "Xác nhận thanh toán",
            `Tổng tiền: ${calculateTotal().toLocaleString()}đ\nBạn có chắc chắn muốn thanh toán?`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Thanh toán",
                    onPress: async () => {
                        await AsyncStorage.removeItem("cart"); // Xóa giỏ hàng sau khi thanh toán
                        setCart([]);
                        Alert.alert("Thành công", "Thanh toán thành công!");
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🛒 Giỏ hàng</Text>

            {cart.length === 0 ? (
                <Text style={styles.emptyText}>Giỏ hàng trống</Text>
            ) : (
                <>
                    <FlatList
                        data={cart}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.itemContainer}>
                                {/* <Image source={{ uri: item.image }} style={styles.image} /> */}
                                <View style={styles.info}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.price}>{item.price}đ</Text>
                                    <Text style={styles.quantity}>Số lượng: {item.quantity}</Text>
                                </View>
                                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                                    <Text style={styles.remove}>Xóa</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    <View style={styles.checkoutContainer}>
                        <Text style={styles.totalText}>Tổng tiền: {calculateTotal().toLocaleString()}đ</Text>
                        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                            <Text style={styles.checkoutText}>Thanh toán</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 16 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
    emptyText: { textAlign: "center", fontSize: 16, color: "#777" },
    itemContainer: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
    image: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: "bold" },
    price: { fontSize: 14, color: "#ff5733" },
    quantity: { fontSize: 14, color: "#555" },
    remove: { color: "red", fontWeight: "bold", marginLeft: 10 },
});
