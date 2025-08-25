// src/navigation/RootNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
// ... import other screens
import Layout from '../components/Layout';
import ProgramsScreen from '../screens/ProgramsScreen';
import ImpactScreen from '../screens/ImpactScreen';
import VolunteerScreen from '../screens/VolunteerScreen';
import DonateScreen from '../screens/DonateScreen';
import BlogScreen from '../screens/BlogScreen';
import ContactScreen from '../screens/ContactScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyOrdersScreen from '../screens/MyOrdersScreen';
import MyDonationScreen from '../screens/MyDonationScreen';
import DonationDetailsScreen from '../screens/DonationDetailsScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import PlantShopScreen from '../screens/PlantShopScreen';
import PlantDetailsScreen from '../screens/PlantDetailsScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import BlogDetailsScreen from '../screens/BlogDetailsScreen';
import AboutScreen from '../screens/AboutScreen'
// Import the legal pages you created:
import CookiesPolicy from '../components/Legal/CookiesPolicy';
import PrivacyPolicy from '../components/Legal/PrivacyPolicy';
import TermsOfService from '../components/Legal/TermsOfService';

const Stack = createStackNavigator();

function wrapWithLayout(Component) {
  return (props) => (
    <Layout>
      <Component {...props} />
    </Layout>
  );
}

export default function RootNavigator({ linking }) {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Home"
          component={wrapWithLayout(HomeScreen)}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Programs" component={ProgramsScreen} />
        <Stack.Screen name="Impact" component={ImpactScreen} />
        <Stack.Screen name="Volunteer" component={VolunteerScreen} />
        <Stack.Screen name="Donate" component={DonateScreen} />
        <Stack.Screen name="Blog" component={BlogScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
        <Stack.Screen name="MyDonation" component={MyDonationScreen} />
        <Stack.Screen name="DonationDetails" component={DonationDetailsScreen} />
        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
        <Stack.Screen name="PlantShop" component={wrapWithLayout(PlantShopScreen)} />
        <Stack.Screen name="PlantDetails" component={wrapWithLayout(PlantDetailsScreen)} />
        <Stack.Screen name="Checkout" component={wrapWithLayout(CheckoutScreen)} />
        <Stack.Screen name="BlogDetail" component={BlogDetailsScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        
        {/* Legal screens */}
        <Stack.Screen
          name="CookiesPolicy"
          component={CookiesPolicy}
          options={{ title: "Cookies Policy" }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{ title: "Privacy Policy" }}
        />
        <Stack.Screen
          name="TermsOfService"
          component={TermsOfService}
          options={{ title: "Terms of Service" }}
        />
        {/* Add other screens similarly */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}