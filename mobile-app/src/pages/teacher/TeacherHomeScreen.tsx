import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text, Card, Button, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {TeacherStackParamList} from '../../navigation/AppNavigator';
import {useClassStore} from '../../store/classStore';

type NavigationProp = NativeStackNavigationProp<TeacherStackParamList>;

const TeacherHomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {classes} = useClassStore();

  const quickActions = [
    {
      icon: 'assignment-add',
      title: '生成作业',
      subtitle: 'AI 智能生成',
      color: '#6200ee',
      action: () => navigation.navigate('HomeworkGeneration'),
    },
    {
      icon: 'people',
      title: '班级管理',
      subtitle: `${classes.length}个班级`,
      color: '#03dac6',
      action: () => navigation.navigate('ClassManagement'),
    },
    {
      icon: 'bar-chart',
      title: '学情统计',
      subtitle: '查看数据分析',
      color: '#ff9800',
      action: () => navigation.navigate('LearningStats'),
    },
    {
      icon: 'message',
      title: '消息通知',
      subtitle: '3 条未读',
      color: '#f44336',
      action: () => {},
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.greeting}>
          早上好，老师！
        </Text>
        <Text variant="bodyMedium" style={styles.date}>
          {new Date().toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          快捷入口
        </Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <Card
              key={index}
              style={[styles.quickActionCard, {borderLeftColor: action.color}]}
              onPress={action.action}>
              <Card.Content style={styles.quickActionContent}>
                <Icon
                  name={action.icon}
                  size={32}
                  color={action.color}
                  style={styles.quickActionIcon}
                />
                <Text variant="titleSmall" style={styles.quickActionTitle}>
                  {action.title}
                </Text>
                <Text variant="bodySmall" style={styles.quickActionSubtitle}>
                  {action.subtitle}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          班级概览
        </Text>
        {classes.map((cls, index) => (
          <Card key={index} style={styles.classCard} onPress={() => navigation.navigate('ClassManagement')}>
            <Card.Content>
              <View style={styles.classCardHeader}>
                <Text variant="titleMedium">{cls.name}</Text>
                <Text variant="bodySmall" style={styles.classCode}>
                  班级码：{cls.code}
                </Text>
              </View>
              <View style={styles.classCardStats}>
                <View style={styles.statItem}>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    学生数
                  </Text>
                  <Text variant="titleSmall">{cls.studentCount}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    作业完成率
                  </Text>
                  <Text variant="titleSmall">{cls.completionRate}%</Text>
                </View>
                <View style={styles.statItem}>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    平均正确率
                  </Text>
                  <Text variant="titleSmall">{cls.accuracyRate}%</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
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
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    fontWeight: 'bold',
  },
  date: {
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  quickActionContent: {
    alignItems: 'center',
    padding: 12,
  },
  quickActionIcon: {
    marginBottom: 8,
  },
  quickActionTitle: {
    marginBottom: 4,
  },
  quickActionSubtitle: {
    color: '#666',
  },
  divider: {
    marginVertical: 8,
  },
  classCard: {
    marginBottom: 12,
  },
  classCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  classCode: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  classCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#666',
    marginBottom: 4,
  },
});

export default TeacherHomeScreen;
