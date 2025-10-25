/**
 * AI Care Dashboard Component
 * Comprehensive display of AI analysis results, treatment recommendations, and care plans
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AICareDashboard = ({ 
  analysisResult, 
  treatmentProducts = [], 
  careRecommendations = [], 
  economicImpact = null,
  onProductPress = () => {},
  onRecommendationPress = () => {}
}) => {
  if (!analysisResult) {
    return null;
  }

  const analysis = analysisResult.analysis || {};
  const hasDisease = analysis.disease_type && analysis.disease_type !== 'none';
  const confidence = Math.round((analysis.confidence || 0) * 100);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Health Status Overview */}
      <Card style={styles.overviewCard}>
        <Card.Content>
          <View style={styles.overviewHeader}>
            <MaterialIcons 
              name={hasDisease ? "warning" : "eco"} 
              size={32} 
              color={hasDisease ? "#FF5722" : "#4CAF50"} 
            />
            <View style={styles.overviewText}>
              <Title style={styles.overviewTitle}>
                {hasDisease ? 'Disease Detected' : 'Plant Healthy'}
              </Title>
              <Paragraph style={styles.overviewSubtitle}>
                {analysis.crop_type || 'Unknown Crop'} • {confidence}% Confidence
              </Paragraph>
            </View>
          </View>
          
          {hasDisease && (
            <Chip 
              style={[styles.severityChip, getSeverityStyle(analysis.severity_level)]}
              textStyle={styles.severityText}
            >
              {analysis.severity_level || 'Unknown'} Severity
            </Chip>
          )}
        </Card.Content>
      </Card>

      {/* Disease Information */}
      {hasDisease && (
        <Card style={styles.diseaseCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Disease Information</Title>
            <Text style={styles.diseaseName}>{analysis.disease_type}</Text>
            
            {analysis.symptoms && analysis.symptoms.length > 0 && (
              <View style={styles.symptomsContainer}>
                <Text style={styles.symptomsTitle}>Symptoms:</Text>
                {analysis.symptoms.map((symptom, index) => (
                  <Text key={index} style={styles.symptomItem}>• {symptom}</Text>
                ))}
              </View>
            )}

            {analysis.affected_parts && analysis.affected_parts.length > 0 && (
              <View style={styles.affectedPartsContainer}>
                <Text style={styles.affectedPartsTitle}>Affected Parts:</Text>
                <Text style={styles.affectedPartsText}>
                  {analysis.affected_parts.join(', ')}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Treatment Products */}
      {treatmentProducts.length > 0 && (
        <Card style={styles.productsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Recommended Treatments</Title>
            <Text style={styles.productsSubtitle}>
              {treatmentProducts.length} products recommended for treatment
            </Text>
            
            {treatmentProducts.slice(0, 3).map((product, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.productItem}
                onPress={() => onProductPress(product)}
              >
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productCategory}>{product.category_name}</Text>
                  {product.ai_relevance_score && (
                    <Text style={styles.relevanceScore}>
                      AI Relevance: {Math.round(product.ai_relevance_score)}%
                    </Text>
                  )}
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#666" />
              </TouchableOpacity>
            ))}
            
            {treatmentProducts.length > 3 && (
              <Text style={styles.moreProducts}>
                +{treatmentProducts.length - 3} more products available
              </Text>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Care Recommendations */}
      {careRecommendations.length > 0 && (
        <Card style={styles.recommendationsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Care Recommendations</Title>
            
            {careRecommendations.map((recommendation, index) => (
              <View key={index} style={styles.recommendationItem}>
                <View style={styles.recommendationHeader}>
                  <MaterialIcons 
                    name={getRecommendationIcon(recommendation.type)} 
                    size={20} 
                    color={getPriorityColor(recommendation.priority)} 
                  />
                  <Text style={styles.recommendationTitle}>
                    {recommendation.title}
                  </Text>
                  <Chip 
                    style={[styles.priorityChip, getPriorityStyle(recommendation.priority)]}
                    textStyle={styles.priorityText}
                  >
                    {recommendation.priority}
                  </Chip>
                </View>
                
                <Text style={styles.recommendationDescription}>
                  {recommendation.description}
                </Text>
                
                {recommendation.steps && recommendation.steps.length > 0 && (
                  <View style={styles.stepsContainer}>
                    {recommendation.steps.slice(0, 3).map((step, stepIndex) => (
                      <Text key={stepIndex} style={styles.stepItem}>
                        • {step}
                      </Text>
                    ))}
                    {recommendation.steps.length > 3 && (
                      <Text style={styles.moreSteps}>
                        +{recommendation.steps.length - 3} more steps
                      </Text>
                    )}
                  </View>
                )}
                
                {index < careRecommendations.length - 1 && <Divider style={styles.divider} />}
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Economic Impact */}
      {economicImpact && (
        <Card style={styles.economicCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Economic Impact</Title>
            <View style={styles.economicInfo}>
              <View style={styles.economicItem}>
                <Text style={styles.economicLabel}>Yield Loss:</Text>
                <Text style={styles.economicValue}>
                  {economicImpact.yieldLossPercentage}%
                </Text>
              </View>
              <View style={styles.economicItem}>
                <Text style={styles.economicLabel}>Economic Loss:</Text>
                <Text style={styles.economicValue}>
                  ${economicImpact.economicLoss}/hectare
                </Text>
              </View>
            </View>
            
            {economicImpact.recommendations && (
              <View style={styles.economicRecommendations}>
                <Text style={styles.economicRecTitle}>Impact Recommendations:</Text>
                {economicImpact.recommendations.map((rec, index) => (
                  <Text key={index} style={styles.economicRecItem}>• {rec}</Text>
                ))}
              </View>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Analysis Metadata */}
      <Card style={styles.metadataCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Analysis Details</Title>
          <View style={styles.metadataGrid}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Analysis Method:</Text>
              <Text style={styles.metadataValue}>{analysisResult.source || 'AI Care Service'}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Confidence:</Text>
              <Text style={styles.metadataValue}>{confidence}%</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Timestamp:</Text>
              <Text style={styles.metadataValue}>
                {new Date(analysisResult.timestamp).toLocaleString()}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

// Helper functions
const getSeverityStyle = (severity) => {
  const styles = {
    low: { backgroundColor: '#E8F5E8' },
    medium: { backgroundColor: '#FFF3E0' },
    high: { backgroundColor: '#FFEBEE' },
    critical: { backgroundColor: '#FCE4EC' }
  };
  return styles[severity] || styles.medium;
};

const getPriorityColor = (priority) => {
  const colors = {
    high: '#F44336',
    medium: '#FF9800',
    low: '#4CAF50'
  };
  return colors[priority] || '#666';
};

const getPriorityStyle = (priority) => {
  const styles = {
    high: { backgroundColor: '#FFEBEE' },
    medium: { backgroundColor: '#FFF3E0' },
    low: { backgroundColor: '#E8F5E8' }
  };
  return styles[priority] || styles.medium;
};

const getRecommendationIcon = (type) => {
  const icons = {
    immediate_treatment: 'local-hospital',
    prevention: 'shield',
    monitoring: 'visibility',
    nutrition: 'eco'
  };
  return icons[type] || 'info';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  overviewCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  overviewText: {
    flex: 1,
    marginLeft: 12,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  overviewSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  severityChip: {
    alignSelf: 'flex-start',
  },
  severityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  diseaseCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  diseaseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 12,
  },
  symptomsContainer: {
    marginBottom: 12,
  },
  symptomsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  symptomItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  affectedPartsContainer: {
    marginBottom: 8,
  },
  affectedPartsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  affectedPartsText: {
    fontSize: 14,
    color: '#666',
  },
  productsCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  productsSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  relevanceScore: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
  moreProducts: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 8,
  },
  recommendationsCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  recommendationItem: {
    marginBottom: 16,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginLeft: 8,
  },
  priorityChip: {
    marginLeft: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  stepsContainer: {
    marginLeft: 8,
  },
  stepItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  moreSteps: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
  },
  divider: {
    marginTop: 8,
  },
  economicCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  economicInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  economicItem: {
    alignItems: 'center',
  },
  economicLabel: {
    fontSize: 14,
    color: '#666',
  },
  economicValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
    marginTop: 4,
  },
  economicRecommendations: {
    marginTop: 12,
  },
  economicRecTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  economicRecItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  metadataCard: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    elevation: 1,
  },
  metadataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metadataItem: {
    width: '48%',
    marginBottom: 8,
  },
  metadataLabel: {
    fontSize: 12,
    color: '#666',
  },
  metadataValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
});

export default AICareDashboard;
