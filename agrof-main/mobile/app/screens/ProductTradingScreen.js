import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
  FlatList,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ProfessionalChart from '../components/ProfessionalChart';

const { width, height } = Dimensions.get('window');

// Mock candlestick data for different products
const candlestickData = {
  'Maize': [
    { date: '2024-01-01', open: 2500, high: 2600, low: 2400, close: 2550, volume: 1000 },
    { date: '2024-01-02', open: 2550, high: 2700, low: 2500, close: 2650, volume: 1200 },
    { date: '2024-01-03', open: 2650, high: 2750, low: 2600, close: 2700, volume: 1500 },
    { date: '2024-01-04', open: 2700, high: 2800, low: 2650, close: 2750, volume: 1800 },
    { date: '2024-01-05', open: 2750, high: 2850, low: 2700, close: 2800, volume: 2000 },
    { date: '2024-01-06', open: 2800, high: 2900, low: 2750, close: 2850, volume: 2200 },
    { date: '2024-01-07', open: 2850, high: 2950, low: 2800, close: 2900, volume: 2500 },
  ],
  'Beans': [
    { date: '2024-01-01', open: 3800, high: 3900, low: 3700, close: 3850, volume: 800 },
    { date: '2024-01-02', open: 3850, high: 4000, low: 3800, close: 3950, volume: 900 },
    { date: '2024-01-03', open: 3950, high: 4100, low: 3900, close: 4050, volume: 1100 },
    { date: '2024-01-04', open: 4050, high: 4200, low: 4000, close: 4150, volume: 1300 },
    { date: '2024-01-05', open: 4150, high: 4300, low: 4100, close: 4250, volume: 1500 },
    { date: '2024-01-06', open: 4250, high: 4400, low: 4200, close: 4350, volume: 1700 },
    { date: '2024-01-07', open: 4350, high: 4500, low: 4300, close: 4450, volume: 1900 },
  ],
  'Coffee': [
    { date: '2024-01-01', open: 8500, high: 8700, low: 8300, close: 8600, volume: 500 },
    { date: '2024-01-02', open: 8600, high: 8900, low: 8500, close: 8800, volume: 600 },
    { date: '2024-01-03', open: 8800, high: 9100, low: 8700, close: 9000, volume: 700 },
    { date: '2024-01-04', open: 9000, high: 9300, low: 8900, close: 9200, volume: 800 },
    { date: '2024-01-05', open: 9200, high: 9500, low: 9100, close: 9400, volume: 900 },
    { date: '2024-01-06', open: 9400, high: 9700, low: 9300, close: 9600, volume: 1000 },
    { date: '2024-01-07', open: 9600, high: 9900, low: 9500, close: 9800, volume: 1100 },
  ],
};

// Mock buyers and sellers data
const tradingData = {
  'Maize': {
    buyers: [
      { id: 1, name: 'John Kato', location: 'Kampala', price: 2800, quantity: 1000, rating: 4.8, avatar: '👨‍🌾' },
      { id: 2, name: 'Sarah Nalubega', location: 'Jinja', price: 2750, quantity: 500, rating: 4.9, avatar: '👩‍🌾' },
      { id: 3, name: 'Peter Mwesigwa', location: 'Masaka', price: 2700, quantity: 800, rating: 4.7, avatar: '👨‍💼' },
      { id: 4, name: 'Grace Nakato', location: 'Mukono', price: 2650, quantity: 1200, rating: 4.6, avatar: '👩‍💼' },
    ],
    sellers: [
      { id: 1, name: 'Farmers Co-op', location: 'Luweero', price: 2900, quantity: 2000, rating: 4.9, avatar: '🏢' },
      { id: 2, name: 'Green Valley Farms', location: 'Mbarara', price: 2850, quantity: 1500, rating: 4.8, avatar: '🌾' },
      { id: 3, name: 'Agro Solutions', location: 'Gulu', price: 2800, quantity: 1000, rating: 4.7, avatar: '🚜' },
      { id: 4, name: 'Local Farmers', location: 'Mbale', price: 2750, quantity: 800, rating: 4.5, avatar: '👨‍🌾' },
    ]
  },
  'Beans': {
    buyers: [
      { id: 1, name: 'Market Traders', location: 'Kampala', price: 4500, quantity: 500, rating: 4.8, avatar: '🏪' },
      { id: 2, name: 'Restaurant Chain', location: 'Jinja', price: 4400, quantity: 300, rating: 4.9, avatar: '🍽️' },
      { id: 3, name: 'Export Company', location: 'Entebbe', price: 4300, quantity: 1000, rating: 4.7, avatar: '🚢' },
    ],
    sellers: [
      { id: 1, name: 'Bean Farmers', location: 'Masaka', price: 4600, quantity: 800, rating: 4.8, avatar: '🌱' },
      { id: 2, name: 'Cooperative Union', location: 'Mukono', price: 4500, quantity: 1200, rating: 4.9, avatar: '🤝' },
    ]
  },
  'Coffee': {
    buyers: [
      { id: 1, name: 'Coffee Exporters', location: 'Kampala', price: 10000, quantity: 200, rating: 4.9, avatar: '☕' },
      { id: 2, name: 'International Buyers', location: 'Entebbe', price: 9800, quantity: 500, rating: 4.8, avatar: '🌍' },
    ],
    sellers: [
      { id: 1, name: 'Coffee Farmers', location: 'Jinja', price: 10200, quantity: 300, rating: 4.9, avatar: '☕' },
      { id: 2, name: 'Mountain Coffee Co.', location: 'Fort Portal', price: 10100, quantity: 400, rating: 4.8, avatar: '🏔️' },
    ]
  }
};

const ProductTradingScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [activeTab, setActiveTab] = useState('chart');
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  const chartData = candlestickData[product.name] || [];
  const tradingInfo = tradingData[product.name] || { buyers: [], sellers: [] };

  const renderCandlestickChart = () => {
    return (
      <View style={styles.tradingViewContainer}>
        {/* Chart Header */}
        <View style={styles.chartHeader}>
          <View style={styles.chartTitleSection}>
            <Text style={styles.chartTitle}>{product.name}</Text>
            <Text style={styles.chartSubtitle}>UGX {chartData[chartData.length - 1]?.close?.toLocaleString()}</Text>
          </View>
          <View style={styles.chartControls}>
            <TouchableOpacity style={styles.timeframeButton}>
              <Text style={styles.timeframeText}>1D</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.timeframeButton}>
              <Text style={styles.timeframeText}>1W</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.timeframeButton}>
              <Text style={styles.timeframeText}>1M</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Professional Victory Chart */}
        <ProfessionalChart 
          data={chartData} 
          type="line" 
          height={250} 
          showVolume={true} 
        />

        {/* Chart Footer */}
        <View style={styles.chartFooter}>
          <View style={styles.priceInfo}>
            <Text style={styles.priceLabel}>Open: UGX {chartData[0]?.open?.toLocaleString()}</Text>
            <Text style={styles.priceLabel}>High: UGX {Math.max(...chartData.map(d => d.high)).toLocaleString()}</Text>
            <Text style={styles.priceLabel}>Low: UGX {Math.min(...chartData.map(d => d.low)).toLocaleString()}</Text>
            <Text style={styles.priceLabel}>Close: UGX {chartData[chartData.length - 1]?.close?.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTraderCard = (trader, type) => (
    <TouchableOpacity
      key={trader.id}
      style={styles.traderCard}
      onPress={() => setSelectedTrader({ ...trader, type })}
    >
      <View style={styles.traderHeader}>
        <Text style={styles.traderAvatar}>{trader.avatar}</Text>
        <View style={styles.traderInfo}>
          <Text style={styles.traderName}>{trader.name}</Text>
          <Text style={styles.traderLocation}>{trader.location}</Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={14} color="#fbbf24" />
            <Text style={styles.rating}>{trader.rating}</Text>
          </View>
        </View>
      </View>
      <View style={styles.traderDetails}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>UGX {trader.price.toLocaleString()}</Text>
        </View>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Quantity</Text>
          <Text style={styles.quantityValue}>{trader.quantity.toLocaleString()} kg</Text>
        </View>
      </View>
      <View style={styles.traderAction}>
        <MaterialIcons 
          name={type === 'buyer' ? 'shopping-cart' : 'sell'} 
          size={20} 
          color="#4CAF50" 
        />
        <Text style={styles.actionText}>
          {type === 'buyer' ? 'Buy from' : 'Sell to'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderChatModal = () => {
    if (!selectedTrader) return null;

    return (
      <View style={styles.chatModal}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setSelectedTrader(null)}>
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.chatTitle}>
            Chat with {selectedTrader.name}
          </Text>
          <View style={styles.traderType}>
            <Text style={styles.traderTypeText}>
              {selectedTrader.type === 'buyer' ? 'Buyer' : 'Seller'}
            </Text>
          </View>
        </View>

        <ScrollView style={styles.chatMessages}>
          {chatMessages.map((msg, index) => (
            <View key={index} style={[
              styles.message,
              msg.sender === 'me' ? styles.myMessage : styles.theirMessage
            ]}>
              <Text style={styles.messageText}>{msg.text}</Text>
              <Text style={styles.messageTime}>{msg.time}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.chatInput}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type your message..."
            value={chatMessage}
            onChangeText={setChatMessage}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => {
              if (chatMessage.trim()) {
                setChatMessages([...chatMessages, {
                  text: chatMessage,
                  sender: 'me',
                  time: new Date().toLocaleTimeString()
                }]);
                setChatMessage('');
              }
            }}
          >
            <MaterialIcons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{product.name} Trading</Text>
        <View style={styles.headerRight}>
          <MaterialIcons name="notifications" size={24} color="#333" />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chart' && styles.activeTab]}
          onPress={() => setActiveTab('chart')}
        >
          <MaterialIcons name="show-chart" size={20} color={activeTab === 'chart' ? '#4CAF50' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'chart' && styles.activeTabText]}>Chart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'buyers' && styles.activeTab]}
          onPress={() => setActiveTab('buyers')}
        >
          <MaterialIcons name="shopping-cart" size={20} color={activeTab === 'buyers' ? '#4CAF50' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'buyers' && styles.activeTabText]}>Buyers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sellers' && styles.activeTab]}
          onPress={() => setActiveTab('sellers')}
        >
          <MaterialIcons name="sell" size={20} color={activeTab === 'sellers' ? '#4CAF50' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'sellers' && styles.activeTabText]}>Sellers</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'chart' && renderCandlestickChart()}
        
        {activeTab === 'buyers' && (
          <View style={styles.tradersContainer}>
            <Text style={styles.sectionTitle}>Buyers ({tradingInfo.buyers.length})</Text>
            {tradingInfo.buyers.map(trader => renderTraderCard(trader, 'buyer'))}
          </View>
        )}
        
        {activeTab === 'sellers' && (
          <View style={styles.tradersContainer}>
            <Text style={styles.sectionTitle}>Sellers ({tradingInfo.sellers.length})</Text>
            {tradingInfo.sellers.map(trader => renderTraderCard(trader, 'seller'))}
          </View>
        )}
      </ScrollView>

      {/* Chat Modal */}
      {renderChatModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerRight: {
    width: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4CAF50',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tradingViewContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  chartTitleSection: {
    flex: 1,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '600',
  },
  chartControls: {
    flexDirection: 'row',
  },
  timeframeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
    backgroundColor: '#333',
    borderRadius: 6,
  },
  timeframeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  priceChartContainer: {
    flexDirection: 'row',
    height: 200,
  },
  yAxis: {
    width: 60,
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#888',
    textAlign: 'right',
  },
  chartArea: {
    flex: 1,
    position: 'relative',
    paddingVertical: 10,
  },
  candlestickContainer: {
    position: 'absolute',
    width: 12,
    height: 180,
    alignItems: 'center',
  },
  wick: {
    position: 'absolute',
    left: 5.5,
    width: 1,
  },
  candlestickBody: {
    position: 'absolute',
    left: 2,
    borderRadius: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  trendLineContainer: {
    position: 'absolute',
    width: 12,
    height: 180,
  },
  trendLine: {
    position: 'absolute',
    width: 2,
    backgroundColor: '#888',
    opacity: 0.6,
  },
  volumeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  volumeTitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  volumeChart: {
    height: 40,
    position: 'relative',
  },
  volumeBar: {
    position: 'absolute',
    bottom: 0,
  },
  chartFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  priceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  priceLabel: {
    fontSize: 10,
    color: '#888',
    marginBottom: 4,
  },
  tradersContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  traderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  traderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  traderAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  traderInfo: {
    flex: 1,
  },
  traderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  traderLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  traderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  quantityContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  quantityLabel: {
    fontSize: 12,
    color: '#666',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  traderAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  actionText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 8,
    fontWeight: '500',
  },
  chatModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  chatTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 16,
  },
  traderType: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  traderTypeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  chatMessages: {
    flex: 1,
    padding: 16,
  },
  message: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 16,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#1f2937',
  },
  messageTime: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProductTradingScreen;
