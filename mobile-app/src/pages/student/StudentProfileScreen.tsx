import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  List,
  Chip,
  Button,
  Divider,
  IconButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StudentStackParamList} from '../../navigation/AppNavigator';
import {useAuthStore} from '../../store/authStore';
import {useHomeworkStore} from '../../store/homeworkStore';

type NavigationProp = NativeStackNavigationProp<StudentStackParamList>;

const StudentProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {user, logout} = useAuthStore();
  const {homeworks} = useHomeworkStore();

  const completedHomeworks = homeworks.filter((hw) => hw.completed);
  const totalScore = completedHomeworks.reduce((sum, hw) => sum + (hw.score || 0), 0);
  const averageScore = completedHomeworks.length > 0 
    ? Math.round(totalScore / completedHomeworks.length) 
    : 0;

  const wrongQuestions = [
    {
      id: 1,
      subject: '数学',
      question: '1/2 + 1/3 = ?',
      wrongAnswer: '2/5',
      correctAnswer: '5/6',
      date: '2024-01-15',
    },
    {
      id: 2,
      subject: '数学',
      question: '3/4 - 1/2 = ?',
      wrongAnswer: '2/2',
      correctAnswer: '1/4',
      date: '2024-01-14',
    },
    {
      id: 3,
      subject: '英语',
      question: 'What is the past tense of "go"?',
      wrongAnswer: 'goed',
      correctAnswer: 'went',
      date: '2024-01-13',
    },
  ];

  const achievements = [
    {icon: 'emoji-events', label: '学习之星', count: 3, color: '#ffd700'},
    {icon: 'local-fire-department', label: '连续打卡', count: 7, color: '#ff5722'},
    {icon: 'speed', label: '最快完成', count: 2, color: '#2196f3'},
    {icon: 'psychology', label: '全对王者', count: 5, color: '#9c27b0'},
  ];

  return (
    <ScrollView style={styles.container}>
      {/* 个人信息卡片 */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Avatar.Text size={80} label={user?.name?.[0] || '学'} style={styles.avatar} />
          <IconButton
            icon="camera"
            size={20}
            style={styles.cameraButton}
            iconColor="white"
          />
        </View>
        <Text variant="headlineSmall" style={styles.userName}>
          {user?.name || '同学'}
        </Text>
        <Text variant="bodyMedium" style={styles.userClass}>
          {user?.className || '三年级一班'}
        </Text>
        <View style={styles.levelBadge}>
          <Icon name="school" size={16} color="white" />
          <Text variant="bodySmall" style={styles.levelText}>
            Lv.5 学习达人
          </Text>
        </View>
      </View>

      {/* 统计卡片 */}
      <View style={styles.statsRow}>
        <Card style={[styles.statCard, styles.statCard1]}>
          <Card.Content style={styles.statContent}>
            <Icon name="check-circle" size={28} color="#4caf50" />
            <Text variant="headlineSmall" style={styles.statValue}>
              {completedHomeworks.length}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              已完成
            </Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, styles.statCard2]}>
          <Card.Content style={styles.statContent}>
            <Icon name="star" size={28} color="#ff9800" />
            <Text variant="headlineSmall" style={styles.statValue}>
              {averageScore}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              平均分
            </Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, styles.statCard3]}>
          <Card.Content style={styles.statContent}>
            <Icon name="error" size={28} color="#f44336" />
            <Text variant="headlineSmall" style={styles.statValue}>
              {wrongQuestions.length}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              错题
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* 成就展示 */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            我的成就
          </Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <View
                  style={[
                    styles.achievementIcon,
                    {backgroundColor: achievement.color + '20'},
                  ]}>
                  <Icon name={achievement.icon} size={28} color={achievement.color} />
                </View>
                <Text variant="bodySmall" style={styles.achievementLabel}>
                  {achievement.label}
                </Text>
                <Text variant="titleSmall" style={styles.achievementCount}>
                  {achievement.count}
                </Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* 错题本 */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              错题本
            </Text>
            <Button mode="text" compact icon="refresh">
              复习
            </Button>
          </View>
          {wrongQuestions.map((item, index) => (
            <View key={item.id}>
              <List.Item
                title={item.question}
                description={`${item.subject} · ${item.date}`}
                left={(props) => (
                  <List.Icon {...props} icon="help-outline" color="#f44336" />
                )}
                right={(props) => (
                  <List.Icon {...props} icon="chevron-right" />
                )}
                style={styles.wrongQuestionItem}
              />
              {index < wrongQuestions.length - 1 && <Divider />}
            </View>
          ))}
          <Button mode="outlined" style={styles.viewAllButton}>
            查看全部错题
          </Button>
        </Card.Content>
      </Card>

      {/* 做题记录 */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            做题记录
          </Text>
          {completedHomeworks.slice(0, 5).map((hw, index) => (
            <View key={index}>
              <List.Item
                title={hw.title}
                description={`${hw.subject} · 得分：${hw.score}`}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={hw.score >= 90 ? 'emoji-events' : 'check-circle'}
                    color={hw.score >= 90 ? '#ffd700' : '#4caf50'}
                  />
                )}
                right={(props) => (
                  <Chip compact textStyle={styles.scoreChip}>
                    {hw.score}分
                  </Chip>
                )}
                style={styles.recordItem}
              />
              {index < Math.min(completedHomeworks.length - 1, 4) && <Divider />}
            </View>
          ))}
          <Button mode="outlined" style={styles.viewAllButton}>
            查看全部记录
          </Button>
        </Card.Content>
      </Card>

      {/* 设置选项 */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <List.Item
            title="消息通知"
            left={(props) => <List.Icon {...props} icon="notifications" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title="隐私设置"
            left={(props) => <List.Icon {...props} icon="lock" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title="关于我们"
            left={(props) => <List.Icon {...props} icon="info" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title="退出登录"
            left={(props) => <List.Icon {...props} icon="logout" color="#f44336" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={logout}
            titleStyle={styles.logoutText}
          />
        </Card.Content>
      </Card>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    paddingTop: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#03dac6',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6200ee',
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userClass: {
    color: '#666',
    marginBottom: 12,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelText: {
    color: 'white',
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    padding: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  statCard1: {
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  statCard2: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  statCard3: {
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  statContent: {
    alignItems: 'center',
    padding: 12,
  },
  statValue: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    color: '#666',
    marginTop: 4,
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  achievementItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementLabel: {
    color: '#666',
    textAlign: 'center',
  },
  achievementCount: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  wrongQuestionItem: {
    paddingVertical: 8,
  },
  recordItem: {
    paddingVertical: 8,
  },
  scoreChip: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  viewAllButton: {
    marginTop: 8,
  },
  logoutText: {
    color: '#f44336',
  },
  bottomPadding: {
    height: 20,
  },
});

export default StudentProfileScreen;
