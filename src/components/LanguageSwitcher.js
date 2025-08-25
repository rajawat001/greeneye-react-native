// src/components/LanguageSwitcher.js

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform, I18nManager, Text } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import i18n from "../utils/i18n";

const LANG_LABELS = {
  en: "English",
  fr: "Français",
  es: "Español",
  ar: "العربية",
  zh: "中文",
  ja: "日本語"
};

const supportedLocales = ['en', 'fr', 'es', 'ar', 'zh', 'ja'];

const countryToLocale = {
  US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en', IN: 'en', SG: 'en',
  IE: 'en', ZA: 'en', NG: 'en', PH: 'en', KE: 'en',
  FR: 'fr', BE: 'fr', CH: 'fr', CM: 'fr', CI: 'fr', SN: 'fr',
  MA: 'fr', TN: 'fr', DZ: 'fr', HT: 'fr',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', PE: 'es', VE: 'es',
  CL: 'es', EC: 'es', GT: 'es', CU: 'es', DO: 'es', BO: 'es',
  HN: 'es', PY: 'es', SV: 'es', NI: 'es', PA: 'es', UY: 'es',
  AE: 'ar', SA: 'ar', EG: 'ar', IQ: 'ar', JO: 'ar', KW: 'ar',
  LB: 'ar', LY: 'ar', MA: 'ar', OM: 'ar', QA: 'ar', SY: 'ar',
  TN: 'ar', YE: 'ar', BH: 'ar', SD: 'ar', DZ: 'ar',
  CN: 'zh', HK: 'zh', MO: 'zh', TW: 'zh', SG: 'zh',
  JP: 'ja'
};

function getLocaleFromCountryCode(code) {
  return countryToLocale[code] || 'en';
}

export default function LanguageSwitcher({ style }) {
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language || "en");

  // Set language on change
  const handleChange = async (value) => {
    if (!value) return;
    setSelectedLang(value);
    i18n.changeLanguage(value);
    await AsyncStorage.setItem("userLang", value);

    // RTL support for Arabic (ar)
    if (value === "ar") {
      if (!I18nManager.isRTL) {
        I18nManager.forceRTL(true);
        if (Platform.OS !== "web") {
          setTimeout(() => {
            if (global?.Expo?.Updates?.reloadAsync) {
              global.Expo.Updates.reloadAsync();
            } else if (global?.DevSettings?.reload) {
              global.DevSettings.reload();
            }
          }, 500);
        }
      }
    } else {
      if (I18nManager.isRTL) {
        I18nManager.forceRTL(false);
        if (Platform.OS !== "web") {
          setTimeout(() => {
            if (global?.Expo?.Updates?.reloadAsync) {
              global.Expo.Updates.reloadAsync();
            } else if (global?.DevSettings?.reload) {
              global.DevSettings.reload();
            }
          }, 500);
        }
      }
    }
  };

  // On mount, set language based on AsyncStorage or Geo IP
  useEffect(() => {
    (async () => {
      let userLang = await AsyncStorage.getItem("userLang");
      if (userLang && supportedLocales.includes(userLang)) {
        setSelectedLang(userLang);
        i18n.changeLanguage(userLang);
        return;
      }
      try {
        // 1. Get device's public IP
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipJson = await ipRes.json();
        const ip = ipJson.ip;
        // 2. Fetch geo data for this IP
        const geoRes = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
          headers: { 'User-Agent': 'GreenEyeApp/1.0' },
          cache: 'no-store',
        });
        const geo = await geoRes.json();
        // 3. Map to locale
        const locale = getLocaleFromCountryCode(geo.country || geo.country_code);
        setSelectedLang(locale);
        i18n.changeLanguage(locale);
        await AsyncStorage.setItem("userLang", locale);
      } catch (err) {
        setSelectedLang("en");
        i18n.changeLanguage("en");
      }
    })();
  }, []);

  return (
    <View style={[styles.wrapper, style]}>
      <RNPickerSelect
        value={selectedLang}
        onValueChange={handleChange}
        items={supportedLocales.map(l => ({
          label: LANG_LABELS[l] || l.toUpperCase(),
          value: l,
        }))}
        style={pickerStyles}
        useNativeAndroidPickerStyle={false}
        placeholder={{}}
        Icon={() => (
          <View style={styles.dropdownIcon}>
            <Text style={{ fontSize: 14, color: "#222" }}>▼</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    minWidth: 110,
    alignItems: "flex-end",
    margin: 0,
  },
  dropdownIcon: {
    position: "absolute",
    right: 14,
    top: 16,
    pointerEvents: "none",
  },
});

const pickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 15,
    fontWeight: "600",
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#f1f5f9",
    borderColor: "#2a5994",
    borderWidth: 1,
    color: "#111827",
    marginLeft: 0,
    marginRight: 0,
    minWidth: 110,
    textAlign: 'left',
  },
  inputAndroid: {
    fontSize: 15,
    fontWeight: "600",
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#f1f5f9",
    borderColor: "#2a5994",
    borderWidth: 1,
    color: "#111827",
    marginLeft: 0,
    marginRight: 0,
    minWidth: 110,
    textAlign: 'left',
  },
  placeholder: {
    color: "#222",
    fontWeight: "600",
  },
});