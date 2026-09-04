import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

const LanguageSelector = ({ onClose }) => {
  const { t } = useTranslation();
  const { currentLanguage, languages, changeLanguage, getCurrentLanguageInfo, isLoading } = useLanguage();

  const handleLanguageChange = async (languageCode) => {
    try {
      await changeLanguage(languageCode);
      if (onClose) {
        onClose();
      }
      Alert.alert(
        t('common.messages.successMessage'),
        `${t('common.labels.language')} changed to ${getCurrentLanguageInfo().name}`
      );
    } catch (error) {
      Alert.alert(
        t('common.messages.errorMessage'),
        'Failed to change language. Please try again.'
      );
    }
  };

  const renderLanguageItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        currentLanguage === item.code && styles.selectedLanguage
      ]}
      onPress={() => handleLanguageChange(item.code)}
      disabled={isLoading}
    >
      <View style={styles.languageInfo}>
        <Text style={styles.flag}>{item.flag}</Text>
        <View style={styles.languageDetails}>
          <Text style={[
            styles.languageName,
            currentLanguage === item.code && styles.selectedText
          ]}>
            {item.name}
          </Text>
          <Text style={[
            styles.languageCode,
            currentLanguage === item.code && styles.selectedText
          ]}>
            {item.code.toUpperCase()}
          </Text>
        </View>
      </View>
      {currentLanguage === item.code && (
        <MaterialIcons name="check" size={24} color="#2E7D32" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={languages}
        keyExtractor={(item) => item.code}
        renderItem={renderLanguageItem}
        style={styles.languageList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  languageList: {
    maxHeight: 400,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedLanguage: {
    backgroundColor: '#f0f8f0',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageDetails: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  languageCode: {
    fontSize: 14,
    color: '#666',
  },
  selectedText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
});

export default LanguageSelector;
