import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';
import { useLocation } from '../contexts/LocationContext';
import api from '../services/api';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { cart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { createOrder } = useOrder();
  const { address } = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (address) {
      setDeliveryAddress(address.formattedAddress || '');
    }
  }, [address]);

  const handlePlaceOrder = async () => {
    if (!deliveryAddress) {
      Alert.alert('Erro', 'Por favor, informe o endereço de entrega');
      return;
    }

    try {
      setLoading(true);
      
      // Create order data
      const orderData = {
        restaurantId: cart.restaurantId,
        customerId: currentUser.customer.id,
        items: cart.items.map(item => ({
          dishId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: cart.total + 5, // Adding delivery fee
        deliveryAddress,
        notes,
        payment: {
          amount: cart.total + 5,
          provider: paymentMethod
        }
      };
      
      // Create order
      const order = await createOrder(orderData);
      
      // Clear cart
      clearCart();
      
      // Show success message
      Alert.alert(
        'Pedido realizado',
        'Seu pedido foi realizado com sucesso!',
        [
          { text: 'Ver pedido', onPress: () => navigation.navigate('OrderDetails', { orderId: order.id }) },
          { text: 'OK', onPress: () => navigation.navigate('Home') }
        ]
      );
      
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Erro', 'Não foi possível realizar o pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finalizar Pedido</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço de Entrega</Text>
          <TextInput
            style={styles.input}
            placeholder="Informe o endereço de entrega"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'CREDIT_CARD' && styles.paymentOptionSelected
            ]}
            onPress={() => setPaymentMethod('CREDIT_CARD')}
          >
            <Ionicons
              name={paymentMethod === 'CREDIT_CARD' ? 'radio-button-on' : 'radio-button-off'}
              size={24}
              color={paymentMethod === 'CREDIT_CARD' ? '#FF4500' : '#666'}
            />
            <View style={styles.paymentOptionContent}>
              <Text style={styles.paymentOptionTitle}>Cartão de Crédito</Text>
              <Text style={styles.paymentOptionSubtitle}>Pague com seu cartão de crédito</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'DEBIT_CARD' && styles.paymentOptionSelected
            ]}
            onPress={() => setPaymentMethod('DEBIT_CARD')}
          >
            <Ionicons
              name={paymentMethod === 'DEBIT_CARD' ? 'radio-button-on' : 'radio-button-off'}
              size={24}
              color={paymentMethod === 'DEBIT_CARD' ? '#FF4500' : '#666'}
            />
            <View style={styles.paymentOptionContent}>
              <Text style={styles.paymentOptionTitle}>Cartão de Débito</Text>
              <Text style={styles.paymentOptionSubtitle}>Pague com seu cartão de débito</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'CASH' && styles.paymentOptionSelected
            ]}
            onPress={() => setPaymentMethod('CASH')}
          >
            <Ionicons
              name={paymentMethod === 'CASH' ? 'radio-button-on' : 'radio-button-off'}
              size={24}
              color={paymentMethod === 'CASH' ? '#FF4500' : '#666'}
            />
            <View style={styles.paymentOptionContent}>
              <Text style={styles.paymentOptionTitle}>Dinheiro</Text>
              <Text style={styles.paymentOptionSubtitle}>Pague em dinheiro na entrega</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observações</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Alguma observação para o restaurante?"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
          
          <View style={styles.orderSummary}>
            <Text style={styles.restaurantName}>{cart.restaurantName}</Text>
            
            {cart.items.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <Text style={styles.orderItemQuantity}>{item.quantity}x</Text>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemPrice}>
                  {formatCurrency(item.price * item.quantity)}
                </Text>
              </View>
            ))}
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatCurrency(cart.total)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Taxa de entrega</Text>
              <Text style={styles.summaryValue}>{formatCurrency(5)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(cart.total + 5)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.placeOrderButtonText}>Fazer Pedido</Text>
              <Text style={styles.placeOrderButtonPrice}>
                {formatCurrency(cart.total + 5)}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  paymentOptionSelected: {
    borderColor: '#FF4500',
    backgroundColor: 'rgba(255, 69, 0, 0.05)',
  },
  paymentOptionContent: {
    marginLeft: 10,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentOptionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  orderSummary: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  orderItemQuantity: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
    width: 25,
  },
  orderItemName: {
    fontSize: 14,
    flex: 1,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4500',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  placeOrderButton: {
    backgroundColor: '#FF4500',
    borderRadius: 8,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeOrderButtonPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
