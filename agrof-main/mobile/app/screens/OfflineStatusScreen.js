/**
 * Offline Status Screen - AGROF
 * Shows offline capabilities, data usage, and sync status
 * Allows users to control offline/online behavior
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import networkManager from '../services/networkManager';
import syncManager from '../services/syncManager';
import hybridStoreApi from '../services/hybridStoreApi';
import offlineCartService from '../services/offlineCartService';

const OfflineStatusScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [wifiOnlyMode, setWifiOnlyMode] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      const [
        syncStats,
        storeStats,
        cartStats
      ] = await Promise.all([
        syncManager.getStats(),
        hybridStoreApi.getStats(),
        offlineCartService.getStats()
      ]);

      setStats({
        sync: syncStats,
        store: storeStats,
        cart: cartStats
      });

      setWifiOnlyMode(storeStats.network.wifiOnlyMode || true);
      setAutoSync(syncStats.sync.autoSyncEnabled);

      setLoading(false);
    } catch (error) {
      console.error('Error loading stats:', error);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const handleSync = async () => {
    try {
      if (!networkManager.isWiFi) {
        alert('Sync requires WiFi connection');
        return;
      }

      setLoading(true);
      const result = await syncManager.forceSyncNow();
      
      if (result.success) {
        alert('Sync completed successfully!');
        await loadStats();
      } else {
        alert(`Sync failed: ${result.message}`);
      }
    } catch (error) {
      alert(`Sync error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleWifiOnly = async (value) => {
    setWifiOnlyMode(value);
    await hybridStoreApi.setWiFiOnlyMode(value);
    await loadStats();
  };

  const toggleAutoSync = async (value) => {
    setAutoSync(value);
    await syncManager.setAutoSync(value);
    await loadStats();
  };

  if (loading && !stats) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={styles.loadingText}>Loading status...</Text>
      </View>
    );
  }

  const networkStatus = stats?.sync?.network || {};
  const syncStatus = stats?.sync?.sync || {};
  const offlineData = stats?.sync?.offline || {};

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons 
          name={networkStatus.isWiFi ? 'wifi' : networkStatus.isOnline ? 'signal-cellular-alt' : 'wifi-off'} 
          size={48} 
          color="#22C55E" 
        />
        <Text style={styles.headerTitle}>Offline System Status</Text>
        <Text style={styles.headerSubtitle}>
          {networkStatus.isWiFi ? '📶 Connected via WiFi' :
           networkStatus.isOnline ? '📱 Online (Mobile Data)' :
           '📴 Offline Mode'}
        </Text>
      </View>

      {/* Network Status Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Network Status</Text>
        
        <View style={styles.statusRow}>
          <MaterialIcons name="wifi" size={24} color={networkStatus.isOnline ? '#22C55E' : '#EF4444'} />
          <View style={styles.statusInfo}>
            <Text style={styles.statusLabel}>Connection</Text>
            <Text style={styles.statusValue}>
              {networkStatus.isOnline ? 
                (networkStatus.isWiFi ? 'WiFi' : 'Mobile Data') :
                'Offline'}
            </Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <MaterialIcons name="cloud" size={24} color={networkStatus.isWiFi ? '#22C55E' : '#F59E0B'} />
          <View style={styles.statusInfo}>
            <Text style={styles.statusLabel}>Connection Type</Text>
            <Text style={styles.statusValue}>{networkStatus.connectionType || 'None'}</Text>
          </View>
        </View>
      </View>

      {/* Offline Data Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Offline Data Available</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Products</Text>
          <Text style={styles.statValue}>{offlineData.products || 0} items</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Categories</Text>
          <Text style={styles.statValue}>{offlineData.categories || 0} categories</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Cart Items</Text>
          <Text style={styles.statValue}>{stats?.cart?.cartItems || 0} items</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Pending Orders</Text>
          <Text style={styles.statValue}>{stats?.cart?.pendingOrders || 0} orders</Text>
        </View>
      </View>

      {/* Sync Status Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sync Status</Text>
        
        <View style={styles.syncInfo}>
          <MaterialIcons 
            name={syncStatus.syncing ? 'sync' : syncStatus.needsSync ? 'sync-problem' : 'check-circle'} 
            size={32} 
            color={syncStatus.syncing ? '#3B82F6' : syncStatus.needsSync ? '#F59E0B' : '#22C55E'} 
          />
          <View style={styles.syncDetails}>
            <Text style={styles.syncStatus}>{syncStatus.message}</Text>
            {syncStatus.lastSync && (
              <Text style={styles.syncTime}>
                Last synced: {new Date(syncStatus.lastSync).toLocaleString()}
              </Text>
            )}
          </View>
        </View>

        {networkStatus.isWiFi && !syncStatus.syncing && (
          <TouchableOpacity 
            style={styles.syncButton}
            onPress={handleSync}
          >
            <MaterialIcons name="sync" size={20} color="#FFFFFF" />
            <Text style={styles.syncButtonText}>Sync Now</Text>
          </TouchableOpacity>
        )}

        {!networkStatus.isWiFi && (
          <Text style={styles.wifiWarning}>
            📶 Connect to WiFi to sync data
          </Text>
        )}
      </View>

      {/* Settings Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Data Saving Settings</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>WiFi-Only Mode</Text>
            <Text style={styles.settingDescription}>
              Only use internet when on WiFi (saves mobile data)
            </Text>
          </View>
          <Switch
            value={wifiOnlyMode}
            onValueChange={toggleWifiOnly}
            trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
            thumbColor={wifiOnlyMode ? '#22C55E' : '#F3F4F6'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Auto-Sync on WiFi</Text>
            <Text style={styles.settingDescription}>
              Automatically sync when WiFi is available
            </Text>
          </View>
          <Switch
            value={autoSync}
            onValueChange={toggleAutoSync}
            trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
            thumbColor={autoSync ? '#22C55E' : '#F3F4F6'}
          />
        </View>
      </View>

      {/* Data Usage Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Data Usage</Text>
        
        <View style={styles.usageRow}>
          <MaterialIcons name="data-usage" size={24} color="#3B82F6" />
          <View style={styles.usageInfo}>
            <Text style={styles.usageLabel}>Estimated Data Saved</Text>
            <Text style={styles.usageValue}>
              ~90% reduction vs always-online mode
            </Text>
          </View>
        </View>

        <Text style={styles.usageNote}>
          💡 With WiFi-only mode, you use data only when needed (orders, AI analysis on mobile data if enabled)
        </Text>
      </View>

      {/* Features Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Offline Features</Text>
        
        <FeatureItem 
          icon="shopping-cart" 
          title="Product Browsing" 
          description="All 304 products available offline"
          available={true}
        />
        <FeatureItem 
          icon="search" 
          title="Product Search" 
          description="Full-text search works offline"
          available={true}
        />
        <FeatureItem 
          icon="chat" 
          title="Chatbot (Basic)" 
          description="150+ pre-programmed answers"
          available={true}
        />
        <FeatureItem 
          icon="camera" 
          title="Disease Detection (Basic)" 
          description="TensorFlow Lite offline detection"
          available={true}
        />
        <FeatureItem 
          icon="shopping-basket" 
          title="Shopping Cart" 
          description="Add items, saved locally"
          available={true}
        />
        <FeatureItem 
          icon="sms" 
          title="SMS Orders" 
          description="Send orders via SMS when offline"
          available={true}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          AGROF Offline-First System v1.0
        </Text>
        <Text style={styles.footerSubtext}>
          Designed for low-data environments
        </Text>
      </View>
    </ScrollView>
  );
};

const FeatureItem = ({ icon, title, description, available }) => (
  <View style={styles.featureItem}>
    <MaterialIcons 
      name={icon} 
      size={24} 
      color={available ? '#22C55E' : '#9CA3AF'} 
    />
    <View style={styles.featureInfo}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
    <MaterialIcons 
      name={available ? 'check-circle' : 'cancel'} 
      size={20} 
      color={available ? '#22C55E' : '#EF4444'} 
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusInfo: {
    marginLeft: 12,
    flex: 1,
  },
  statusLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  syncInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  syncDetails: {
    marginLeft: 12,
    flex: 1,
  },
  syncStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  syncTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  syncButton: {
    flexDirection: 'row',
    backgroundColor: '#22C55E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  wifiWarning: {
    textAlign: 'center',
    color: '#F59E0B',
    fontSize: 14,
    fontStyle: 'italic',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  usageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  usageInfo: {
    marginLeft: 12,
    flex: 1,
  },
  usageLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  usageValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22C55E',
  },
  usageNote: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  featureInfo: {
    marginLeft: 12,
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  featureDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});

export default OfflineStatusScreen;



