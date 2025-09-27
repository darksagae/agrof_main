import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const MiniChart = ({ data, isPositive = true, height = 30, width = 50 }) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;
  
  // Generate mixed color data for better visualization
  const getMixedColors = () => {
    const colors = [];
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        colors.push('#22c55e');
      } else {
        const isUp = data[i] > data[i - 1];
        colors.push(isUp ? '#22c55e' : '#ef4444');
      }
    }
    return colors;
  };

  const mixedColors = getMixedColors();

  return (
    <View style={[styles.container, { height, width }]}>
      <View style={styles.chart}>
        {data.map((value, index) => {
          const currentHeight = ((value - minValue) / range) * (height - 4);
          const lineColor = mixedColors[index];
          
          return (
            <View key={index} style={styles.lineContainer}>
              {/* Simple vertical line for each data point */}
              <View
                style={[
                  styles.line,
                  {
                    width: 2,
                    height: Math.max(currentHeight, 2),
                    backgroundColor: lineColor,
                    left: index * 4,
                    top: height - currentHeight - 2,
                  }
                ]}
              />
              {/* Data point */}
              <View
                style={[
                  styles.dot,
                  {
                    left: index * 4 - 1,
                    top: height - currentHeight - 3,
                    backgroundColor: lineColor,
                  }
                ]}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chart: {
    position: 'relative',
    flex: 1,
    padding: 2,
  },
  lineContainer: {
    position: 'absolute',
    width: 8,
    height: 30,
  },
  line: {
    position: 'absolute',
    height: 2,
    borderRadius: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  dot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1,
  },
});

export default MiniChart;
