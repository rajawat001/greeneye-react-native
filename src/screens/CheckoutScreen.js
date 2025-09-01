// src/screens/CheckoutScreen.js
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Platform,
    KeyboardAvoidingView,
    FlatList,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import useCart from "../components/cart/useCart";
import RazorpayCheckout from 'react-native-razorpay';

const formatPrice = (p) => `₹${Number(p).toLocaleString()}`;

export default function CheckoutScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const {
        cart,
        refresh: refreshCart,
    } = useCart();

    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch user info & cart
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                if (!token) return;
                const res = await axios.get(
                    `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/users/profile`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const { name, email, phone, address } = res.data;
                setUserInfo((prev) => ({
                    ...prev,
                    name: name || "",
                    email: email || "",
                    phone: phone || "",
                    street: address?.street || "",
                    city: address?.city || "",
                    state: address?.state || "",
                    pincode: address?.pincode || "",
                }));
            } catch (error) {
                // console.error("Failed to fetch user info:", error);
            }
        };
        fetchUserInfo();
        refreshCart();
    }, []);

    const total =
        cart?.items?.reduce(
            (sum, item) => sum + (item.plant.price || 0) * item.quantity,
            0
        ) || 0;

    // Form validation
    const validate = () => {
        const { name, email, phone, street, city, state, pincode } = userInfo;
        if (!name || !email || !phone || !street || !city || !state || !pincode)
            return t("fillAllFields");
        if (!/^\d{10}$/.test(phone)) return t("checkout.invalidPhone");
        if (!/\S+@\S+\.\S+/.test(email)) return t("checkout.invalidEmail");
        if (!/^\d{6}$/.test(pincode)) return t("checkout.invalidPincode");
        if (!cart || !cart.items || cart.items.length === 0) return t("checkout.cartEmpty");
        return "";
    };

    const handlePlaceOrder = async () => {
        setError("");
        setSuccess("");
        const validationMsg = validate();
        if (validationMsg) {
            setError(validationMsg);
            return;
        }
        setPlacing(true);
        try {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
                setError(t("checkout.loginRequired"));
                setPlacing(false);
                return;
            }

            const orderItems = cart.items.map((item) => ({
                plant: item.plant._id,
                quantity: item.quantity,
            }));

            const shippingAddress = {
                name: userInfo.name,
                street: userInfo.street,
                city: userInfo.city,
                state: userInfo.state,
                pincode: userInfo.pincode,
                phone: userInfo.phone,
            };

            const orderData = {
                orderItems,
                shippingAddress,
                paymentMethod,
            };

            // 1. Place order in backend
            const res = await axios.post(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/orders`,
                orderData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const createdOrder = res.data;

            if (paymentMethod === "Razorpay") {
                const RAZORPAY_KEY_ID = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID;

                const options = {
                    key: RAZORPAY_KEY_ID,
                    amount: createdOrder.totalPrice * 100,
                    currency: "INR",
                    name: "GreenEye Store",
                    description: t("checkout.razorpayDesc"),
                    order_id: createdOrder.paymentResult.id, // Razorpay order_id from backend
                    prefill: {
                        name: userInfo.name,
                        email: userInfo.email,
                        contact: userInfo.phone,
                    },
                    theme: { color: "#388e3c" },
                };

                if (!RazorpayCheckout || !RazorpayCheckout.open) {
                    console.error("RazorpayCheckout module not loaded.");
                    setError("Razorpay module not available. Please check your installation.");
                    setPlacing(false);
                    return;
                }

                // 2. Open Razorpay Checkout
                RazorpayCheckout.open(options)
                    .then(() => {
                        // ✅ Don't verify here, webhook will handle verification
                        setSuccess(t("checkout.paymentProcessing"));
                        setTimeout(() => {
                            navigation.navigate("MyOrders");
                        }, 1000);
                    })
                    .catch((err) => {
                        console.log("Razorpay payment error:", err);
                        setError(t("checkout.paymentCancelled") || "Payment cancelled");
                    });
            } else {
                // COD case
                setSuccess(t("checkout.orderPlacedCOD"));
                setTimeout(() => {
                    navigation.navigate("MyOrders");
                }, 1200);
            }
        } catch (err) {
            setError(err.response?.data?.message || t("checkout.placeOrderFail"));
        } finally {
            setPlacing(false);
        }
    };

    // Input field UI
    const renderInput = (label, name, opts = {}) => (
        <View style={styles.inputBlock} key={name}>
            <Text style={styles.inputLabel}>
                {label} <Text style={{ color: "#b62222" }}>*</Text>
            </Text>
            <TextInput
                style={[styles.input, opts.textArea && styles.textArea]}
                value={userInfo[name]}
                onChangeText={(text) => setUserInfo({ ...userInfo, [name]: text })}
                keyboardType={opts.keyboardType || "default"}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={opts.maxLength}
                multiline={!!opts.textArea}
                numberOfLines={opts.textArea ? 3 : 1}
                placeholder={opts.placeholder}
                placeholderTextColor="#b6ccb9"
            />
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#f6faf8" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("PlantShop")}
                        style={{ marginBottom: 8 }}
                    >
                        <Text style={styles.backLink}>← {t("checkout.backToShop")}</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>{t("checkout.checkoutTitle")}</Text>
                    {/* Form */}
                    {renderInput(t("checkout.name"), "name")}
                    {renderInput(t("checkout.email"), "email", {
                        keyboardType: "email-address",
                        placeholder: "your@email.com",
                    })}
                    {renderInput(t("checkout.phone"), "phone", {
                        keyboardType: "phone-pad",
                        maxLength: 10,
                        placeholder: "10-digit mobile",
                    })}
                    {renderInput(t("checkout.shippingAddress"), "street", {
                        textArea: true,
                        placeholder: t("checkout.addressPlaceholder"),
                    })}
                    <View style={{ flexDirection: "row", gap: 10 }}>
                        <View style={{ flex: 1 }}>
                            {renderInput(t("checkout.city"), "city")}
                        </View>
                        <View style={{ flex: 1 }}>
                            {renderInput(t("checkout.state"), "state")}
                        </View>
                    </View>
                    {renderInput(t("checkout.pincode"), "pincode", {
                        keyboardType: "number-pad",
                        maxLength: 6,
                        placeholder: "6-digit PIN",
                    })}

                    {/* Payment Method */}
                    <Text style={[styles.inputLabel, { marginTop: 12 }]}>
                        {t("checkout.paymentMethod")} <Text style={{ color: "#b62222" }}>*</Text>
                    </Text>
                    <View style={styles.payMethodRow}>
                        {["COD", "Razorpay"].map((method) => (
                            <TouchableOpacity
                                key={method}
                                style={[
                                    styles.payMethodBtn,
                                    paymentMethod === method && styles.payMethodBtnActive,
                                ]}
                                onPress={() => setPaymentMethod(method)}
                                activeOpacity={0.85}
                            >
                                <Text
                                    style={[
                                        styles.payMethodBtnText,
                                        paymentMethod === method && { color: "#fff" },
                                    ]}
                                >
                                    {method === "COD" ? t("checkout.cod") : t("checkout.onlinePayment")}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Order Summary */}
                    <Text style={[styles.inputLabel, { marginTop: 18, marginBottom: 8 }]}>
                        {t("checkout.orderSummary")}
                    </Text>
                    {cart && cart.items?.length > 0 ? (
                        <View style={{ marginBottom: 5 }}>
                            {cart.items.map((item) => (
                                <View style={styles.summaryRow} key={item._id}>
                                    <Text style={styles.summaryName}>{item.plant.name}</Text>
                                    <Text style={styles.summaryQty}>×{item.quantity}</Text>
                                    <Text style={styles.summaryPrice}>
                                        {formatPrice(item.plant.price * item.quantity)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={{ color: "#b62222", marginBottom: 8 }}>
                            {t("checkout.cartNoItems")}
                        </Text>
                    )}

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>{t("checkout.total")}</Text>
                        <Text style={styles.totalValue}>{formatPrice(total)}</Text>
                    </View>

                    {error ? <Text style={styles.errorMsg}>{error}</Text> : null}
                    {success ? <Text style={styles.successMsg}>{success}</Text> : null}

                    <TouchableOpacity
                        style={[
                            styles.placeOrderBtn,
                            (placing || !cart?.items?.length) && { opacity: 0.5 },
                        ]}
                        onPress={handlePlaceOrder}
                        disabled={placing || !cart?.items?.length}
                    >
                        {placing ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.placeOrderBtnText}>{t("checkout.placeOrder")}</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flexGrow: 1,
        justifyContent: "center",
        backgroundColor: "#f6faf8",
        paddingTop: 28,
        paddingBottom: 24,
    },
    container: {
        backgroundColor: "#fff",
        borderRadius: 16,
        marginHorizontal: 12,
        padding: 20,
        shadowColor: "#388e3c",
        shadowOpacity: 0.09,
        shadowRadius: 18,
        elevation: 7,
        maxWidth: 600,
        alignSelf: "center",
    },
    backLink: {
        color: "#388e3c",
        fontWeight: "700",
        fontSize: 15.5,
        marginLeft: 2,
    },
    title: {
        fontWeight: "bold",
        fontSize: 22,
        marginBottom: 12,
        marginTop: 2,
        textAlign: "center",
        color: "#388e3c",
        letterSpacing: 0.2,
    },
    inputBlock: {
        marginBottom: 14,
    },
    inputLabel: {
        fontWeight: "600",
        fontSize: 15,
        marginBottom: 2,
        color: "#233b29",
    },
    input: {
        backgroundColor: "#f6faf8",
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: "#d3e6d7",
        paddingVertical: 10,
        paddingHorizontal: 13,
        fontSize: 15.5,
        fontWeight: "600",
        color: "#334d3c",
        marginTop: 2,
    },
    textArea: {
        minHeight: 64,
        textAlignVertical: "top",
    },
    payMethodRow: {
        flexDirection: "row",
        gap: 13,
        marginTop: 7,
        marginBottom: 6,
    },
    payMethodBtn: {
        backgroundColor: "#e5f3ea",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginRight: 6,
        borderWidth: 1.5,
        borderColor: "#bde2c6",
    },
    payMethodBtnActive: {
        backgroundColor: "#388e3c",
        borderColor: "#388e3c",
    },
    payMethodBtnText: {
        color: "#388e3c",
        fontWeight: "bold",
        fontSize: 16,
    },
    summaryRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    summaryName: {
        flex: 1.5,
        fontWeight: "600",
        color: "#222",
        fontSize: 15,
    },
    summaryQty: {
        flex: 0.5,
        color: "#555",
        fontWeight: "700",
        fontSize: 14.5,
        textAlign: "center",
    },
    summaryPrice: {
        flex: 1,
        textAlign: "right",
        color: "#388e3c",
        fontWeight: "bold",
        fontSize: 15.5,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 9,
        marginBottom: 12,
    },
    totalLabel: {
        fontWeight: "bold",
        fontSize: 17,
        color: "#233b29",
        marginRight: 7,
    },
    totalValue: {
        fontWeight: "bold",
        fontSize: 17,
        color: "#388e3c",
    },
    errorMsg: {
        color: "#b62222",
        marginTop: 7,
        marginBottom: 3,
        textAlign: "center",
        fontWeight: "bold",
    },
    successMsg: {
        color: "#2e7d32",
        marginTop: 7,
        marginBottom: 3,
        textAlign: "center",
        fontWeight: "bold",
    },
    placeOrderBtn: {
        backgroundColor: "#388e3c",
        borderRadius: 9,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 13,
        shadowColor: "#388e3c",
        shadowOpacity: 0.13,
        shadowRadius: 6,
        elevation: 3,
    },
    placeOrderBtnText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 17,
        letterSpacing: 0.2,
    },
});