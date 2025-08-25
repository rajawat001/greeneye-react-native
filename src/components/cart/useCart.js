// src/components/cart/useCart.js
import { useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const getToken = async () => await AsyncStorage.getItem("authToken");

export default function useCart() {
  const [cart, setCart] = useState({ items: [] });
  const [open, setOpen] = useState(false);

  // Fetch token and generate headers when needed
  const getHeaders = useCallback(async () => {
    const token = await getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const fetchCart = useCallback(async () => {
    const token = await getToken();
    if (!token) return setCart({ items: [] });
    try {
      const headers = await getHeaders();
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/cart`,
        { headers }
      );
      setCart(res.data);
    } catch {
      setCart({ items: [] });
    }
  }, [getHeaders]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = useCallback(
    async (plantOrId, quantity = 1) => {
      const token = await getToken();
      if (!token) throw new Error("LOGIN_REQUIRED");
      const headers = await getHeaders();
      const plantId = typeof plantOrId === "string" ? plantOrId : plantOrId._id;
      await axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/cart`,
        { plantId, quantity },
        { headers }
      );
      await fetchCart();
      setOpen(true);
    },
    [getHeaders, fetchCart]
  );

  const removeFromCart = useCallback(
    async (itemId) => {
      const token = await getToken();
      if (!token) return;
      const headers = await getHeaders();
      await axios.delete(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/cart/${itemId}`,
        { headers }
      );
      await fetchCart();
    },
    [getHeaders, fetchCart]
  );

  const changeQty = useCallback(
    async (itemId, newQty) => {
      const token = await getToken();
      if (!token || newQty < 1) return;
      const headers = await getHeaders();
      await axios.put(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/cart/${itemId}`,
        { quantity: newQty },
        { headers }
      );
      await fetchCart();
    },
    [getHeaders, fetchCart]
  );

  const cartCount = useMemo(
    () => cart.items?.reduce((s, i) => s + i.quantity, 0) || 0,
    [cart]
  );
  const total = useMemo(
    () =>
      cart.items?.reduce((s, i) => s + (i.plant?.price || 0) * i.quantity, 0) ||
      0,
    [cart]
  );

  return {
    cart,
    cartCount,
    total,
    open,
    setOpen,
    addToCart,
    removeFromCart,
    changeQty,
    refresh: fetchCart,
  };
}