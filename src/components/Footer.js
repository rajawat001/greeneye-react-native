import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme';

export default function Footer() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  // You can use react-native-vector-icons here for real icons.
  const socialLinks = [
    { url: "https://www.facebook.com/piyush.gig", label: "Facebook", icon: "🌱" },
    { url: "https://twitter.com/", label: "Twitter", icon: "🐦" },
    { url: "https://instagram.com/", label: "Instagram", icon: "📸" },
    { url: "https://www.linkedin.com/in/piyugig/", label: "LinkedIn", icon: "💼" },
  ];

  return (
    <View style={styles.footer}>
      <View style={styles.footerContent}>
        {/* Logo + Mission + Social */}
        <View style={styles.footerSection}>
          <View style={styles.footerLogo}>
            <Text style={styles.footerLogoIcon}>🌱</Text>
            <Text style={styles.footerLogoText}>GreenEye</Text>
          </View>
          <Text style={styles.footerMission}>{t("footer.mission")}</Text>
          <View style={styles.footerSocial}>
            {socialLinks.map((item) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => Linking.openURL(item.url)}
                accessibilityLabel={item.label}
                style={styles.socialBtn}
              >
                <Text style={styles.socialIcon}>{item.icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.footerSection}>
          <Text style={styles.sectionTitle}>{t("footer.quickLinks")}</Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => navigation.navigate("About")}>
              <Text style={styles.footerLink}>{t('footer.about')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Programs")}>
              <Text style={styles.footerLink}>{t('footer.programs')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Volunteer")}>
              <Text style={styles.footerLink}>{t('footer.volunteer')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Donate")}>
              <Text style={styles.footerLink}>{t('footer.donate')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Programs */}
        <View style={styles.footerSection}>
          <Text style={styles.sectionTitle}>{t('footer.programs')}</Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => navigation.navigate("Programs")}>
              <Text style={styles.footerLink}>{t('footer.urbanReforestation')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Programs")}>
              <Text style={styles.footerLink}>{t('footer.communityDrives')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Programs")}>
              <Text style={styles.footerLink}>{t('footer.schoolPrograms')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Programs")}>
              <Text style={styles.footerLink}>{t('footer.corporatePartnerships')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.footerSection}>
          <Text style={styles.sectionTitle}>{t('footer.contactInfo')}</Text>
          <View style={styles.footerContact}>
            <Text style={styles.footerContactItem}>📍 {t('footer.address')}</Text>
            <Text style={styles.footerContactItem}>📞 7023277322</Text>
            <Text style={styles.footerContactItem}>✉️ contact@greeneye.foundation</Text>
          </View>
        </View>
      </View>

      {/* Bottom Bar */}
      <View style={styles.footerBottom}>
        <View style={styles.footerBottomContent}>
          <Text style={styles.footerBottomText}>
            © 2025 GreenEye. {t('footer.rightsReserved')}
          </Text>
          <View style={styles.footerBottomLinks}>
            <TouchableOpacity onPress={() => navigation.navigate("PrivacyPolicy")}>
              <Text style={styles.footerBottomLink}>{t('footer.privacy')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("TermsOfService")}>
              <Text style={styles.footerBottomLink}>{t('footer.terms')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("CookiesPolicy")}>
              <Text style={styles.footerBottomLink}>{t('footer.cookies')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: colors.darkGreen,
    paddingTop: 36,
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  footerContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
    columnGap: 0,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  footerSection: {
    flex: 1,
    minWidth: 170,
    maxWidth: 200,
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    color: colors.lightGreen,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  footerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  footerLogoIcon: {
    fontSize: 30,
    marginRight: 9,
    color: colors.lightGreen,
  },
  footerLogoText: {
    fontWeight: "700",
    fontSize: 20,
    color: colors.white,
  },
  footerMission: {
    color: colors.white,
    lineHeight: 22,
    marginBottom: 10,
    opacity: 0.9,
    fontSize: 14,
  },
  footerSocial: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 6,
  },
  socialBtn: {
    marginRight: 10,
    backgroundColor: colors.primaryGreen,
    borderRadius: 50,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    color: colors.lightGreen,
    fontSize: 18,
  },
  footerLinks: {
    marginTop: 2,
    marginBottom: 2,
  },
  footerLink: {
    color: colors.white,
    opacity: 0.85,
    marginBottom: 7,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  footerContact: {
    marginTop: 2,
    marginBottom: 2,
  },
  footerContactItem: {
    color: colors.white,
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.9,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerBottom: {
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    paddingVertical: 18,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  footerBottomContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerBottomText: {
    color: colors.white,
    opacity: 0.8,
    fontSize: 13,
  },
  footerBottomLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  footerBottomLink: {
    color: colors.white,
    opacity: 0.8,
    fontSize: 13,
    marginLeft: 12,
    textDecorationLine: 'underline',
  },
});