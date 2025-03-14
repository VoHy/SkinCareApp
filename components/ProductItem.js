import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ProductItem({ item, onPress, onFavorite, isFavorite }) {
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={() => onPress(item)}>
            {/* Huy hiệu "Nổi bật" */}
            {item.isFeatured && (
                <View style={styles.featuredBadge}>
                    <Text style={styles.featuredText}>Nổi bật</Text>
                </View>
            )}

            {/* Hình ảnh sản phẩm */}
            <Image source={item.image} style={styles.image} resizeMode="cover" />

            {/* Thông tin sản phẩm */}
            <View style={styles.infoContainer}>
                <Text style={styles.name} numberOfLines={2}>{item.name}</Text>

                {/* Hiển thị giá sản phẩm */}
                <View style={styles.priceContainer}>
                    {item.finalPrice && item.finalPrice < item.price ? (
                        <>
                            <Text style={styles.oldPrice}>{item.price?.toLocaleString()}đ</Text>
                            <Text style={styles.finalPrice}>{item.finalPrice?.toLocaleString()}đ</Text>
                        </>
                    ) : (
                        <Text style={styles.price}>{item.price?.toLocaleString()}đ</Text>
                    )}
                </View>
            </View>

            {/* Nút yêu thích */}
            <TouchableOpacity style={styles.favoriteButton} onPress={() => onFavorite(item)}>
                <Icon name={isFavorite ? "heart" : "heart-o"} size={20} color={isFavorite ? "red" : "#999"} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        margin: 8,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#eee",
    },
    image: {
        width: 130,
        height: 130,
        borderRadius: 10,
    },
    infoContainer: {
        marginTop: 8,
        alignItems: "center",
    },
    name: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    price: {
        fontSize: 14,
        color: "#FF6F61",
        fontWeight: "bold",
    },
    oldPrice: {
        fontSize: 12,
        textDecorationLine: "line-through",
        color: "gray",
        marginRight: 5,
    },
    discountPrice: {
        fontSize: 14,
        fontWeight: "bold",
        color: "red",
    },
    featuredBadge: {
        position: "absolute",
        top: 5,
        left: 5,
        backgroundColor: "#FFB400",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 5,
    },
    featuredText: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#fff",
    },
    favoriteButton: {
        position: "absolute",
        top: 10,
        right: 10,
        padding: 5,
    },
});
