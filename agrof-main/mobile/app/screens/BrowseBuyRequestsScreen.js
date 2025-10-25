import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../config/supabaseConfig';

const BrowseBuyRequestsScreen = ({ navigation }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [buyRequests, setBuyRequests] = useState([]);

  useEffect(() => {
    loadBuyRequests();
  }, []);

  const loadBuyRequests = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('buy_requests')
        .select(`
          *,
          buyer:users!buy_requests_buyer_id_fkey(id, full_name, phone, email),
          p2p_products(id, name, unit_of_measure)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setBuyRequests(data || []);
    } catch (error) {
      console.error('Error loading buy requests:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading buy requests...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#2c5530" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Browse Buy Requests</Text>
        <TouchableOpacity onPress={loadBuyRequests}>
          <MaterialIcons name="refresh" size={24} color="#2c5530" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {buyRequests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="shopping-cart" size={80} color="#CCC" />
            <Text style={styles.emptyTitle}>No Buy Requests</Text>
            <Text style={styles.emptyText}>
              There are no active buy requests at the moment.
            </Text>
          </View>
        ) : (
          buyRequests.map((request) => (
            <TouchableOpacity
              key={request.id}
              style={styles.requestCard}
              onPress={() => navigation.navigate('BuyRequestDetails', { requestId: request.id })}
            >
              <View style={styles.requestHeader}>
                <Text style={styles.requestProduct}>{request.p2p_products?.name}</Text>
                <Text style={styles.requestQuantity}>{request.quantity_needed} {request.p2p_products?.unit_of_measure}</Text>
              </View>
              
              <Text style={styles.requestMessage} numberOfLines={2}>
                {request.message}
              </Text>
              
              <View style={styles.requestFooter}>
                <Text style={styles.requestBuyer}>
                  By: {request.buyer?.full_name || 'Anonymous'}
                </Text>
                <Text style={styles.requestDate}>
                  {new Date(request.created_at).toLocaleDateString()}
                </Text>
              </View>
              
              {request.target_price && (
                <Text style={styles.requestPrice}>
                  Target Price: UGX {request.target_price.toLocaleString()}
                </Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c5530',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  requestCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  requestProduct: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c5530',
    flex: 1,
  },
  requestQuantity: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  requestMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestBuyer: {
    fontSize: 12,
    color: '#999',
  },
  requestDate: {
    fontSize: 12,
    color: '#999',
  },
  requestPrice: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default BrowseBuyRequestsScreen;


