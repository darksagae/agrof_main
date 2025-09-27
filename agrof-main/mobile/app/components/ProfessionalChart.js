import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const ProfessionalChart = ({ data, type = 'line', height = 200, showVolume = true }) => {
  const maxPrice = Math.max(...data.map(d => d.close));
  const minPrice = Math.min(...data.map(d => d.close));
  const maxVolume = Math.max(...data.map(d => d.volume));
  const priceRange = maxPrice - minPrice;
  const chartHeight = height;
  const pointSpacing = (width - 80) / (data.length - 1);

  const renderLineChart = () => (
    <View style={styles.chartContainer}>
      {/* Y-axis labels */}
      <View style={styles.yAxis}>
        {[maxPrice, (maxPrice + minPrice) / 2, minPrice].map((price, index) => (
          <Text key={index} style={styles.yAxisLabel}>
            UGX {price.toLocaleString()}
          </Text>
        ))}
      </View>
      
      {/* Chart area */}
      <View style={styles.chartArea}>
        {/* Grid lines */}
        <View style={styles.gridContainer}>
          {[0, 0.5, 1].map((ratio, index) => (
            <View
              key={index}
              style={[
                styles.gridLine,
                { top: ratio * chartHeight }
              ]}
            />
          ))}
        </View>

        {/* Line chart */}
        <View style={styles.lineContainer}>
          {data.map((point, index) => {
            if (index === 0) return null;
            
            const currentY = (maxPrice - point.close) / priceRange * chartHeight;
            const previousY = (maxPrice - data[index - 1].close) / priceRange * chartHeight;
            const currentX = index * pointSpacing;
            const previousX = (index - 1) * pointSpacing;
            
            const lineLength = Math.sqrt(
              Math.pow(currentX - previousX, 2) + Math.pow(currentY - previousY, 2)
            );
            const lineAngle = Math.atan2(currentY - previousY, currentX - previousX) * (180 / Math.PI);
            
            return (
              <View key={index}>
                {/* Line segment */}
                <View
                  style={[
                    styles.lineSegment,
                    {
                      left: previousX,
                      top: previousY,
                      width: lineLength,
                      transform: [{ rotate: `${lineAngle}deg` }],
                    }
                  ]}
                />
                {/* Data point */}
                <View
                  style={[
                    styles.dataPoint,
                    {
                      left: currentX - 3,
                      top: currentY - 3,
                    }
                  ]}
                />
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );

  const renderVolumeChart = () => (
    <View style={styles.volumeContainer}>
      <Text style={styles.volumeTitle}>Volume</Text>
      <View style={styles.volumeChart}>
        {data.map((point, index) => {
          const volumeHeight = (point.volume / maxVolume) * 40;
          const isGreen = point.close > (index > 0 ? data[index - 1].close : point.close);
          
          return (
            <View key={index} style={[styles.volumeBar, { 
              left: index * (pointSpacing + 1),
              height: volumeHeight,
              backgroundColor: isGreen ? '#22c55e' : '#ef4444',
              width: Math.max(8, pointSpacing - 1),
            }]} />
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {type === 'line' && renderLineChart()}
      {showVolume && type === 'line' && renderVolumeChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chartContainer: {
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
  gridContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gridLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#333',
    opacity: 0.3,
  },
  lineContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  lineSegment: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#22c55e',
    borderRadius: 1,
  },
  dataPoint: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#1e1e1e',
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
});

export default ProfessionalChart;
