const calculateFinalPrice = (price, discount) => price * (1 - discount / 100);

const FakeData = [
    {
        id: "1",
        name: "Serum Dưỡng Ẩm",
        price: 299000,
        discount: 10,
        isFeatured: true,
        image: require("../assets/Image/skincare1.png"),
        category: "Serum",
        description: "Serum cấp ẩm sâu, giúp da luôn mịn màng và tươi trẻ.",
        rating: 4.8,
        reviewCount: 2,
        finalPrice: calculateFinalPrice(299000, 10),
        stock: 20,
        feedback: [
            { id: "f1", user: "Nguyễn An", comment: "Dùng rất thích, da mềm mịn hơn!", rating: 5, date: "2024-03-14" },
            { id: "f2", user: "Linh Đan", comment: "Dưỡng ẩm tốt nhưng giá hơi cao.", rating: 4, date: "2024-03-12" }
        ]
    },
    {
        id: "2",
        name: "Kem Chống Nắng SPF 50",
        price: 399000,
        discount: 5,
        isFeatured: true,
        image: require("../assets/Image/skincare2.png"),
        category: "Kem Chống Nắng",
        description: "Bảo vệ da khỏi tia UV, giúp da không bị sạm nám.",
        rating: 4.6,
        reviewCount: 2,
        finalPrice: calculateFinalPrice(399000, 5),
        stock: 15,
        feedback: [
            { id: "f3", user: "Bảo Trâm", comment: "Không nhờn rít, chống nắng tốt.", rating: 5, date: "2024-03-13" },
            { id: "f4", user: "Minh Tú", comment: "Thấm nhanh nhưng hơi khô da.", rating: 4, date: "2024-03-10" }
        ]
    },
    {
        id: "3",
        name: "Toner Cấp Ẩm",
        price: 199000,
        discount: 0,
        isFeatured: true,
        image: require("../assets/Image/skincare6.png"),
        category: "Toner",
        description: "Toner dưỡng ẩm sâu, cân bằng độ pH và làm dịu da.",
        rating: 4.7,
        reviewCount: 2,
        finalPrice: calculateFinalPrice(199000, 0),
        stock: 10,
        feedback: [
            { id: "f5", user: "Thanh Hằng", comment: "Mùi thơm dễ chịu, dưỡng ẩm tốt.", rating: 5, date: "2024-03-12" },
            { id: "f6", user: "Hải Yến", comment: "Không hợp với da dầu lắm.", rating: 3.5, date: "2024-03-11" }
        ]
    },
    {
        id: "4",
        name: "Sữa Rửa Mặt Dịu Nhẹ",
        price: 159000,
        discount: 10,
        isFeatured: false,
        image: require("../assets/Image/skincare4.png"),
        category: "Sữa Rửa Mặt",
        description: "Sữa rửa mặt nhẹ nhàng, làm sạch sâu mà không gây khô da.",
        rating: 4.5,
        reviewCount: 2,
        finalPrice: calculateFinalPrice(159000, 10),
        stock: 25,
        feedback: [
            { id: "f7", user: "Ngọc Lan", comment: "Rửa sạch, không bị khô da.", rating: 5, date: "2024-03-09" },
            { id: "f8", user: "Trí Tài", comment: "Dịu nhẹ nhưng chưa đủ sạch sâu.", rating: 4, date: "2024-03-08" }
        ]
    },
    {
        id: "5",
        name: "Mặt Nạ Đất Sét",
        price: 259000,
        discount: 0,
        isFeatured: false,
        image: require("../assets/Image/skincare5.png"),
        category: "Mặt Nạ",
        description: "Thải độc và làm sạch sâu, giúp da sáng mịn hơn.",
        rating: 4.9,
        reviewCount: 2,
        finalPrice: calculateFinalPrice(259000,0),
        stock: 18,
        feedback: [
            { id: "f9", user: "Phương Thảo", comment: "Da sáng hơn sau vài lần dùng!", rating: 5, date: "2024-03-07" },
            { id: "f10", user: "Văn Đức", comment: "Làm sạch tốt nhưng hơi khó rửa.", rating: 4.5, date: "2024-03-06" }
        ]
    },
    {
        id: "6",
        name: "Kem Dưỡng Ban Đêm",
        price: 349500,
        discount: 0,
        isFeatured: false,
        image: require("../assets/Image/skincare3.png"),
        category: "Kem Dưỡng",
        description: "Dưỡng ẩm và phục hồi da khi ngủ, giúp da căng mọng.",
        rating: 4.8,
        reviewCount: 2,
        finalPrice: calculateFinalPrice(349500, 0),
        stock: 12,
        feedback: [
            { id: "f11", user: "Hồng Nhung", comment: "Da mềm hơn sau 1 tuần!", rating: 5, date: "2024-03-05" },
            { id: "f12", user: "Tiến Lộc", comment: "Dưỡng tốt nhưng hơi nhờn.", rating: 4, date: "2024-03-04" }
        ]
    },
];

export default FakeData;
