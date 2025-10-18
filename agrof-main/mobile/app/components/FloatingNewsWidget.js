import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  ScrollView,
  Dimensions,
  Modal
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const FloatingNewsWidget = ({ news = [], onNewsPress, onClose }) => {
  const [expanded, setExpanded] = useState(false);
  const [showFullNews, setShowFullNews] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  
  // Position state
  const pan = useRef(new Animated.ValueXY({ x: width - 80, y: height * 0.3 })).current;
  
  // Track if user is dragging
  const isDragging = useRef(false);
  const tapTimeout = useRef(null);
  
  // Pan responder for dragging
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !expanded, // Only allow drag when collapsed
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Start dragging if moved more than 5 pixels
        const { dx, dy } = gestureState;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          isDragging.current = true;
          if (tapTimeout.current) {
            clearTimeout(tapTimeout.current);
          }
          return true;
        }
        return false;
      },
      onPanResponderGrant: () => {
        isDragging.current = true;
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gesture) => {
        pan.flattenOffset();
        
        // Snap to edges
        let finalX = pan.x._value;
        let finalY = pan.y._value;
        
        // Keep within screen bounds
        if (finalX < 0) finalX = 10;
        if (finalX > width - 70) finalX = width - 70;
        if (finalY < 100) finalY = 100;
        if (finalY > height - 200) finalY = height - 200;
        
        Animated.spring(pan, {
          toValue: { x: finalX, y: finalY },
          useNativeDriver: false,
          friction: 7
        }).start();
        
        // Reset dragging state after a short delay
        tapTimeout.current = setTimeout(() => {
          isDragging.current = false;
        }, 100);
      },
    })
  ).current;

  const handleButtonPress = () => {
    if (!isDragging.current) {
      setExpanded(true);
    }
  };

  // Get urgent/high priority news count
  const urgentCount = news.filter(n => n.priority === 'urgent' || n.priority === 'high').length;

  const handleNewsItemPress = (newsItem) => {
    setSelectedNews(newsItem);
    setShowFullNews(true);
    if (onNewsPress) onNewsPress(newsItem);
  };

  const getNewsIcon = (type) => {
    switch (type) {
      case 'fraud': return 'warning';
      case 'price': return 'trending-down';
      case 'disease': return 'coronavirus';
      case 'weather': return 'wb-sunny';
      case 'research': return 'science';
      default: return 'article';
    }
  };

  const getNewsColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#f44336';
      case 'high': return '#FF9800';
      case 'medium': return '#2196F3';
      default: return '#4CAF50';
    }
  };

  if (!expanded) {
    // Collapsed widget - Floating button (FULLY DRAGGABLE!)
    return (
      <Animated.View
        style={[
          styles.floatingButton,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={[styles.floatingButtonInner, urgentCount > 0 && styles.urgentButton]}
          onPress={handleButtonPress}
          activeOpacity={0.9}
          delayPressIn={50}
        >
          <MaterialIcons name="newspaper" size={28} color="white" />
          {news.length > 0 && (
            <View style={[styles.badge, urgentCount > 0 && styles.urgentBadge]}>
              <Text style={styles.badgeText}>{news.length}</Text>
            </View>
          )}
          {/* Drag indicator dots */}
          <View style={styles.dragIndicator}>
            <View style={styles.dragDot} />
            <View style={styles.dragDot} />
            <View style={styles.dragDot} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // Expanded widget - News list (ALSO DRAGGABLE!)
  return (
    <>
      <Animated.View
        style={[
          styles.expandedWidget,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
      >
        {/* Header - Draggable handle */}
        <View 
          style={styles.widgetHeader}
          {...panResponder.panHandlers}
        >
          <MaterialIcons name="drag-indicator" size={20} color="white" style={{ opacity: 0.7 }} />
          <MaterialIcons name="newspaper" size={20} color="white" />
          <Text style={styles.widgetTitle}>Ag News</Text>
          <TouchableOpacity onPress={() => setExpanded(false)} style={styles.collapseButton}>
            <MaterialIcons name="minimize" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* News Items */}
        <ScrollView style={styles.newsScroll} showsVerticalScrollIndicator={false}>
          {news.length === 0 ? (
            <View style={styles.emptyNews}>
              <Text style={styles.emptyNewsText}>No news updates</Text>
            </View>
          ) : (
            news.slice(0, 5).map((item, index) => (
              <TouchableOpacity
                key={item.id || index}
                style={[styles.newsItem, { borderLeftColor: getNewsColor(item.priority) }]}
                onPress={() => handleNewsItemPress(item)}
              >
                <View style={styles.newsItemHeader}>
                  <MaterialIcons
                    name={getNewsIcon(item.type)}
                    size={16}
                    color={getNewsColor(item.priority)}
                  />
                  <Text style={styles.newsItemTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                </View>
                <Text style={styles.newsItemPreview} numberOfLines={2}>
                  {item.message}
                </Text>
                <Text style={styles.newsItemTime}>{item.timeAgo || 'Recent'}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* Footer */}
        {news.length > 5 && (
          <TouchableOpacity style={styles.viewAllButton} onPress={() => setShowFullNews(true)}>
            <Text style={styles.viewAllText}>View All ({news.length})</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Full News Modal */}
      <Modal
        visible={showFullNews}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowFullNews(false)}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFullNews(false)}>
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Agricultural News</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* News Content */}
          <ScrollView style={styles.modalContent}>
            {selectedNews ? (
              <View style={styles.fullNewsArticle}>
                <View style={[styles.newsPriorityBadge, { backgroundColor: getNewsColor(selectedNews.priority) }]}>
                  <Text style={styles.newsPriorityText}>{selectedNews.priority?.toUpperCase()}</Text>
                </View>
                <Text style={styles.fullNewsTitle}>{selectedNews.title}</Text>
                <Text style={styles.fullNewsMessage}>{selectedNews.message}</Text>
                {selectedNews.source && (
                  <Text style={styles.newsSource}>Source: {selectedNews.source}</Text>
                )}
              </View>
            ) : (
              news.map((item, index) => (
                <TouchableOpacity
                  key={item.id || index}
                  style={styles.fullNewsItem}
                  onPress={() => setSelectedNews(item)}
                >
                  <View style={[styles.newsTypeIndicator, { backgroundColor: getNewsColor(item.priority) }]}>
                    <MaterialIcons name={getNewsIcon(item.type)} size={24} color="white" />
                  </View>
                  <View style={styles.fullNewsItemContent}>
                    <Text style={styles.fullNewsItemTitle}>{item.title}</Text>
                    <Text style={styles.fullNewsItemPreview} numberOfLines={2}>
                      {item.message}
                    </Text>
                    <View style={styles.newsItemMeta}>
                      <Text style={styles.newsItemMetaText}>{item.timeAgo || 'Recent'}</Text>
                      {item.location && (
                        <Text style={styles.newsItemMetaText}>📍 {item.location}</Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    zIndex: 1000,
  },
  floatingButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  urgentButton: {
    backgroundColor: '#f44336',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF9800',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  urgentBadge: {
    backgroundColor: '#fff',
  },
  badgeText: {
    color: '#f44336',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dragIndicator: {
    position: 'absolute',
    bottom: 4,
    flexDirection: 'row',
    gap: 2,
  },
  dragDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  expandedWidget: {
    position: 'absolute',
    width: 280,
    maxHeight: 400,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
    overflow: 'hidden',
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    gap: 8,
  },
  widgetTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  collapseButton: {
    padding: 4,
  },
  newsScroll: {
    maxHeight: 300,
  },
  newsItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderLeftWidth: 3,
    backgroundColor: 'white',
  },
  newsItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  newsItemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  newsItemPreview: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 4,
  },
  newsItemTime: {
    fontSize: 10,
    color: '#999',
  },
  emptyNews: {
    padding: 20,
    alignItems: 'center',
  },
  emptyNewsText: {
    color: '#999',
    fontSize: 13,
  },
  viewAllButton: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  viewAllText: {
    color: '#4CAF50',
    fontSize: 13,
    fontWeight: '600',
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4CAF50',
    padding: 15,
    paddingTop: 50,
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
  },
  fullNewsArticle: {
    backgroundColor: 'white',
    padding: 20,
    margin: 15,
    borderRadius: 10,
    elevation: 2,
  },
  newsPriorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  newsPriorityText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  fullNewsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  fullNewsMessage: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 16,
  },
  newsSource: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
  },
  fullNewsItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    gap: 12,
  },
  newsTypeIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullNewsItemContent: {
    flex: 1,
  },
  fullNewsItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  fullNewsItemPreview: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 6,
  },
  newsItemMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  newsItemMetaText: {
    fontSize: 11,
    color: '#999',
  },
});

export default FloatingNewsWidget;

