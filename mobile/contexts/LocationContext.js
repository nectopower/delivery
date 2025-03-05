import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load saved address on app start
  useEffect(() => {
    const loadSavedAddress = async () => {
      try {
        const savedAddress = await SecureStore.getItemAsync('userAddress');
        if (savedAddress) {
          setAddress(JSON.parse(savedAddress));
        }
      } catch (error) {
        console.error('Error loading saved address:', error);
      }
    };

    loadSavedAddress();
  }, []);

  const requestLocationPermission = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error requesting location permission:', err);
      setError('Failed to request location permission');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const hasPermission = await requestLocationPermission();
      
      if (!hasPermission) {
        return null;
      }
      
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setLocation(currentLocation);
      
      // Get address from coordinates
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      
      if (addressResponse && addressResponse.length > 0) {
        const addressData = addressResponse[0];
        const formattedAddress = {
          street: addressData.street,
          number: addressData.name,
          district: addressData.district,
          city: addressData.city,
          region: addressData.region,
          country: addressData.country,
          postalCode: addressData.postalCode,
          formattedAddress: `${addressData.street}, ${addressData.name}, ${addressData.city}`
        };
        
        setAddress(formattedAddress);
        
        // Save address to storage
        await SecureStore.setItemAsync('userAddress', JSON.stringify(formattedAddress));
        
        return formattedAddress;
      }
      
      return null;
    } catch (err) {
      console.error('Error getting current location:', err);
      setError('Failed to get current location');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveAddress = async (addressData) => {
    try {
      setAddress(addressData);
      await SecureStore.setItemAsync('userAddress', JSON.stringify(addressData));
      return true;
    } catch (err) {
      console.error('Error saving address:', err);
      return false;
    }
  };

  const value = {
    location,
    address,
    loading,
    error,
    getCurrentLocation,
    saveAddress
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
