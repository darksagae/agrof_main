import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const ProductSkeleton = ({ style }) => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();

    return () => shimmer.stop();
  }, [shimmerAnimation]);

  const shimmerStyle = {
    opacity: shimmerAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    }),
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.imagePlaceholder, shimmerStyle]} />
      <Animated.View style={[styles.textPlaceholder, styles.titlePlaceholder, shimmerStyle]} />
      <Animated.View style={[styles.textPlaceholder, styles.pricePlaceholder, shimmerStyle]} />
      <Animated.View style={[styles.textPlaceholder, styles.descriptionPlaceholder, shimmerStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 0,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 1,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  textPlaceholder: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginTop: 8,
  },
  titlePlaceholder: {
    height: 16,
    width: '80%',
    alignSelf: 'center',
  },
  pricePlaceholder: {
    height: 14,
    width: '60%',
    alignSelf: 'center',
    marginTop: 4,
  },
  descriptionPlaceholder: {
    height: 12,
    width: '90%',
    alignSelf: 'center',
    marginTop: 4,
  },
});

export default ProductSkeleton;
