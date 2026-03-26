import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, FlatList} from 'react-native';
import {Text, Card, Button, Chip, IconButton, Badge} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StudentStackParamList} from '../../navigation/AppNavigator';
import {useHomeworkStore} from '../../store/homeworkStore';

type NavigationProp = NativeStackNavigationProp<StudentStackParamList>;

const StudentHomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {homeworks} = useHomeworkStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredHomeworks = homeworks.filter((hw) => {
    if (filter === 'pending') return !hw.completed;
    if (filter === 'completed') return hw.completed;
    return true;
  });

  const pendingCount = homeworks.filter((hw) => !hw.completed).length;
  const completedCount = homeworks.filter((hw) => hw.completed).length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#4caf50';
      case 'medium':
        return '#ff9800';
      case 'hard':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '简单';
      case 'medium':
        return '中等';
      case 'hard':
        return '困难';
      default:
        return difficulty;
    }
  };

  const renderHomeworkCard = ({item}: {item: any}) => (
    <Card
      style={[styles.homeworkCard, item.completed && styles.completedCard]}
      onPress={() =>
        navigation.navigate('GamePractice', {homeworkId: item.id})
      }>
      <Card.Content>
        <View style={styles.homeworkHeader}>
          <View style={styles.homeworkInfo}>
            <Text variant="titleMedium" style={styles.homeworkTitle}>
              {item.title}
            </Text>
            <Text variant="bodySmall" style={styles.homeworkSubject}>
              {item.subject} · {item.grade}
            </Text>
          </View>
          {item.completed ? (
            <Badge style={styles.completedBadge}>✓</Badge>
          ) : (
            <Badge style={styles.newBadge}>NEW</Badge>
          )}
        </View>

        <View style={styles.homeworkTags}>
          <Chip
            compact
            textStyle={styles.difficultyChip}
            style={[
              styles.difficultyChipContainer,
              {borderColor: getDifficultyColor(item.difficulty)},
            ]}>
            {getDifficultyLabel(item.difficulty)}
          </Chip>
          <Chip
            compact
            icon="format-list-numbered"
            style={styles.questionCountChip}>
            {item.questionCount} 题
          </Chip>
          {item.mode === 'ai' && (
            <Chip
              compact
              icon="auto-awesome"
              style={styles.aiModeChip}>
              AI 剧本
            </Chip>
          )}
        </View>

        <View style={styles.homeworkFooter}>
          <View style={styles.dueDate}>
            <Icon name="access-time" size={16} color="#666" />
            <Text variant="bodySmall" style={styles.dueDateText}>
              截止：{item.dueDate}
            </Text>
          </View>
          {item.completed ? (
            <View style={styles.score}>
              <Text variant="bodySmall" style={styles.scoreLabel}>
                得分
              </Text>
              <Text variant="titleSmall" style={styles.scoreValue}>
                {item.score}
              </Text>
            </View>
          ) : (
            <Button
              mode="outlined"
              compact
              onPress={() =>
                navigation.navigate('GamePractice', {homeworkId: item.id})
              }>
              开始做题
            </Button>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text variant="headlineSmall" style={styles.greeting}>
            加油，同学！
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            你有 {pendingCount} 个作业待完成
          </Text>
        </View>
        <IconButton icon="notifications" size={28} />
      </View>

      <View style={styles.statsRow}>
        <Card style={[styles.statCard, styles.statCard1]}>
          <Card.Content style={styles.statContent}>
            <Icon name="pending-actions" size={32} color="#ff9800" />
            <View style={styles.statInfo}>
              <Text variant="bodySmall" style={styles.statLabel}>
                待完成
              </Text>
              <Text variant="headlineSmall" style={styles.statValue}>
                {pendingCount}
              </Text>
            </View>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, styles.statCard2]}>
          <Card.Content style={styles.statContent}>
            <Icon name="check-circle" size={32} color="#4caf50" />
            <View style={styles.statInfo}>
              <Text variant="bodySmall" style={styles.statLabel}>
                已完成
              </Text>
              <Text variant="headlineSmall" style={styles.statValue}>
                {completedCount}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.filterSection}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          作业列表
        </Text>
        <View style={styles.filterChips}>
          <Chip
            selected={filter === 'all'}
            onPress={() => setFilter('all')}
            style={styles.filterChip}>
            全部
          </Chip>
          <Chip
            selected={filter === 'pending'}
            onPress={() => setFilter('pending')}
            style={styles.filterChip}>
            未完成
          </Chip>
          <Chip
            selected={filter === 'completed'}
            onPress={() => setFilter('completed')}
            style={styles.filterChip}>
            已完成
          </Chip>
        </View>
      </View>

      <View style={styles.homeworkList}>
        {filteredHomeworks.length > 0 ? (
          filteredHomeworks.map((hw, index) => (
            <View key={index} style={styles.homeworkWrapper}>
              {renderHomeworkCard({item: hw})}
            </View>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Icon name="inbox" size={64} color="#ccc" />
              <Text variant="bodyLarge" style={styles.emptyText}>
                暂无作业
              </Text>
              <Text variant="bodySmall" style={styles.emptyHint}>
                老师布置作业后会显示在这里
              </Text>
            </Card.Content>
          </Card>
        )}
      </View>

      <View style={styles.bottomPadding} />
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
    padding: 16,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    marginTop: 4,
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
    borderLeftColor: '#ff9800',
  },
  statCard2: {
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statInfo: {
    marginLeft: 12,
    flex: 1,
  },
  statLabel: {
    color: '#666',
  },
  statValue: {
    fontWeight: 'bold',
  },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filterChips: {
    flexDirection: 'row',
  },
  filterChip: {
    marginRight: 8,
  },
  homeworkList: {
    paddingHorizontal: 16,
  },
  homeworkWrapper: {
    marginBottom: 12,
  },
  homeworkCard: {
    elevation: 2,
  },
  completedCard: {
    opacity: 0.7,
    backgroundColor: '#e8f5e9',
  },
  homeworkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  homeworkInfo: {
    flex: 1,
  },
  homeworkTitle: {
    fontWeight: 'bold',
  },
  homeworkSubject: {
    color: '#666',
    marginTop: 4,
  },
  completedBadge: {
    backgroundColor: '#4caf50',
    width: 24,
    height: 24,
  },
  newBadge: {
    backgroundColor: '#ff9800',
  },
  homeworkTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  difficultyChipContainer: {
    marginRight: 8,
    borderWidth: 1,
  },
  difficultyChip: {
    fontSize: 12,
  },
  questionCountChip: {
    marginRight: 8,
  },
  aiModeChip: {
    backgroundColor: '#e3f2fd',
  },
  homeworkFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  dueDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDateText: {
    color: '#666',
    marginLeft: 4,
  },
  score: {
    alignItems: 'flex-end',
  },
  scoreLabel: {
    color: '#666',
  },
  scoreValue: {
    fontWeight: 'bold',
    color: '#4caf50',
  },
  emptyCard: {
    elevation: 0,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  emptyContent: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    color: '#666',
  },
  emptyHint: {
    color: '#999',
    marginTop: 4,
  },
  bottomPadding: {
    height: 20,
  },
});

export default StudentHomeScreen;
