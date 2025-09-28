// Test file for ChatBot Button functionality
// This file can be used to test the ChatBot button across different screens

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ChatBotButton from './components/ChatBotButton';

// Test component to verify ChatBot button renders correctly
const TestChatBotButton = () => {
  const handleChatBotPress = () => {
    console.log('ChatBot button pressed!');
    // In a real implementation, this would open the chatbot modal
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ChatBot Button Test</Text>
      <Text style={styles.subtitle}>Testing ChatBot button functionality</Text>
      
      {/* Test different sizes */}
      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>Default Size (60px)</Text>
        <ChatBotButton onPress={handleChatBotPress} />
      </View>
      
      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>Large Size (80px)</Text>
        <ChatBotButton onPress={handleChatBotPress} size={80} />
      </View>
      
      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>Small Size (40px)</Text>
        <ChatBotButton onPress={handleChatBotPress} size={40} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  testSection: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 15,
  },
});

export default TestChatBotButton;
