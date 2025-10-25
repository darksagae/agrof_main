import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const AILoadingAnimation = ({ size = 80, color = '#4CAF50' }) => {
  const animations = useRef([]);
  const centerDotScale = useRef(new Animated.Value(1)).current;
  const centerDotOpacity = useRef(new Animated.Value(1)).current;

  // Initialize animations for each dot
  useEffect(() => {
    animations.current = Array.from({ length: 12 }, () => ({
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
    }));

    startAnimation();
  }, []);

  const startAnimation = () => {
    // Center dot pulse animation
    const centerPulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(centerDotScale, {
            toValue: 1.2,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(centerDotOpacity, {
            toValue: 0.8,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(centerDotScale, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(centerDotOpacity, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    centerPulse.start();

    // Create the main animation sequence
    const createDotAnimation = (dotIndex, delay) => {
      const dot = animations.current[dotIndex];
      const angle = (dotIndex * 30) * (Math.PI / 180); // 30 degrees per dot
      const radius = size / 2;
      
      const targetX = Math.cos(angle) * radius;
      const targetY = Math.sin(angle) * radius;

      return Animated.sequence([
        // Delay before emergence
        Animated.delay(delay),
        
        // Emerge from center
        Animated.parallel([
          Animated.timing(dot.scale, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(dot.opacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(dot.translateX, {
            toValue: targetX,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(dot.translateY, {
            toValue: targetY,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        
        // Hold position
        Animated.delay(200),
        
        // Fall back to center
        Animated.parallel([
          Animated.timing(dot.scale, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot.opacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot.translateX, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot.translateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]);
    };

    // Create staggered animations for all dots
    const dotAnimations = animations.current.map((_, index) => 
      createDotAnimation(index, index * 150)
    );

    // Loop the entire sequence
    const loopAnimation = () => {
      Animated.sequence([
        Animated.parallel(dotAnimations),
        Animated.delay(500), // Pause before restart
      ]).start(() => {
        // Reset all dots to center
        animations.current.forEach(dot => {
          dot.scale.setValue(0);
          dot.opacity.setValue(0);
          dot.translateX.setValue(0);
          dot.translateY.setValue(0);
        });
        loopAnimation();
      });
    };

    loopAnimation();
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Center dot */}
      <Animated.View
        style={[
          styles.centerDot,
          {
            transform: [{ scale: centerDotScale }],
            opacity: centerDotOpacity,
            backgroundColor: color,
            width: size * 0.3,
            height: size * 0.3,
          },
        ]}
      />
      
      {/* 12 dots in clock formation */}
      {animations.current.map((dot, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              transform: [
                { translateX: dot.translateX },
                { translateY: dot.translateY },
                { scale: dot.scale },
              ],
              opacity: dot.opacity,
              backgroundColor: color,
              width: size * 0.08,
              height: size * 0.08,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  centerDot: {
    position: 'absolute',
    borderRadius: 50,
    zIndex: 10,
  },
  dot: {
    position: 'absolute',
    borderRadius: 50,
  },
});

export default AILoadingAnimation;
