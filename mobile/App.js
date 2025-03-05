import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { LocationProvider } from './contexts/LocationContext';

// Navigators
import AuthNavigator from './navigation/AuthNavigator';
import TabNavigator from './navigation/TabNavigator';

// Screens that are not part of the tab navigator
import RestaurantScreen from './screens/RestaurantScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderDetailsScreen from './screens/OrderDetailsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <OrderProvider>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Auth" component={AuthNavigator} />
                <Stack.Screen name="Main" component={TabNavigator} />
                <Stack.Screen name="Restaurant" component={RestaurantScreen} />
                <Stack.Screen name="Checkout" component={CheckoutScreen} />
                <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
              </Stack.Navigator>
            </OrderProvider>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
