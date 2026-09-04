import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

const ProfileSettingsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { getCurrentLanguageInfo } = useLanguage();

  const settingsItems = [
    {
      id: 'language',
      title: t('common.labels.language'),
      subtitle: getCurrentLanguageInfo().name,
      icon: 'language',
      component: 'language'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Push notifications',
      icon: 'notifications',
      action: 'toggle'
    },
    {
      id: 'privacy',
      title: 'Privacy',
      subtitle: 'Data and privacy settings',
      icon: 'privacy-tip',
      action: 'navigate'
    },
    {
      id: 'about',
      title: 'About',
      subtitle: 'App version and info',
      icon: 'info',
      action: 'navigate'
    },
    {
      id: 'help',
      title: t('common.navigation.help'),
      subtitle: 'Get help and support',
      icon: 'help',
      action: 'navigate'
    }
  ];

  const handleSettingPress = (item) => {
    switch (item.action) {
      case 'toggle':
        Alert.alert(
          item.title,
          'This feature will be implemented soon.',
          [{ text: t('common.buttons.ok') }]
        );
        break;
      case 'navigate':
        Alert.alert(
          item.title,
          'This feature will be implemented soon.',
          [{ text: t('common.buttons.ok') }]
        );
        break;
      default:
        break;
    }
  };

  const renderSettingItem = (item) => {
    if (item.component === 'language') {
      return <LanguageSelector key={item.id} />;
    }

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={() => handleSettingPress(item)}
      >
        <View style={styles.settingContent}>
          <MaterialIcons name={item.icon} size={24} color="#2E7D32" />
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={20} color="#666" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('common.navigation.settings')}</Text>
        <Text style={styles.headerSubtitle}>Customize your AGROF experience</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        {settingsItems.map(renderSettingItem)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <MaterialIcons name="person" size={24} color="#2E7D32" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Profile</Text>
              <Text style={styles.settingSubtitle}>Manage your profile</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color="#666" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <MaterialIcons name="security" size={24} color="#2E7D32" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Security</Text>
              <Text style={styles.settingSubtitle}>Password and security</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color="#666" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <MaterialIcons name="contact-support" size={24} color="#2E7D32" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Contact Support</Text>
              <Text style={styles.settingSubtitle}>Get help from our team</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color="#666" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <MaterialIcons name="rate-review" size={24} color="#2E7D32" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Rate App</Text>
              <Text style={styles.settingSubtitle}>Share your feedback</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color="#666" />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15,
    marginLeft: 5,
  },
  settingItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingText: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProfileSettingsScreen;
