import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text, Card, Chip, SegmentedButton} from 'react-native-paper';
import {LineChart, BarChart, PieChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const LearningStatsScreen = () => {
  const [timeRange, setTimeRange] = useState('week');

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#6200ee',
    },
  };

  const weekData = {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [
      {
        data: [0.75, 0.82, 0.78, 0.85, 0.88, 0.90, 0.87],
      },
    ],
  };

  const subjectData = {
    labels: ['语文', '数学', '英语', '物理', '化学'],
    datasets: [
      {
        data: [85, 92, 78, 88, 90],
      },
    ],
  };

  const pieData = [
    {
      name: '已完成',
      population: 156,
      color: '#6200ee',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: '未完成',
      population: 24,
      color: '#ff9800',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: '逾期',
      population: 8,
      color: '#f44336',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
  ];

  const topStudents = [
    {rank: 1, name: '张小明', accuracy: 98, completed: 45},
    {rank: 2, name: '李小红', accuracy: 96, completed: 44},
    {rank: 3, name: '王小刚', accuracy: 95, completed: 43},
    {rank: 4, name: '刘小丽', accuracy: 94, completed: 42},
    {rank: 5, name: '陈小强', accuracy: 93, completed: 41},
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.title}>
          学情统计
        </Text>
        <SegmentedButton
          value={timeRange}
          onValueChange={setTimeRange}
          buttons={[
            {label: '周', value: 'week'},
            {label: '月', value: 'month'},
            {label: '学期', value: 'semester'},
          ]}
          style={styles.timeRangeSelector}
        />
      </View>

      <View style={styles.overviewSection}>
        <View style={styles.overviewCards}>
          <Card style={[styles.overviewCard, styles.overviewCard1]}>
            <Card.Content>
              <Text variant="bodySmall" style={styles.overviewLabel}>
                总完成率
              </Text>
              <Text variant="headlineMedium" style={styles.overviewValue}>
                86.7%
              </Text>
            </Card.Content>
          </Card>
          <Card style={[styles.overviewCard, styles.overviewCard2]}>
            <Card.Content>
              <Text variant="bodySmall" style={styles.overviewLabel}>
                平均正确率
              </Text>
              <Text variant="headlineMedium" style={styles.overviewValue}>
                88.5%
              </Text>
            </Card.Content>
          </Card>
          <Card style={[styles.overviewCard, styles.overviewCard3]}>
            <Card.Content>
              <Text variant="bodySmall" style={styles.overviewLabel}>
                活跃学生
              </Text>
              <Text variant="headlineMedium" style={styles.overviewValue}>
                180
              </Text>
            </Card.Content>
          </Card>
          <Card style={[styles.overviewCard, styles.overviewCard4]}>
            <Card.Content>
              <Text variant="bodySmall" style={styles.overviewLabel}>
                总作业数
              </Text>
              <Text variant="headlineMedium" style={styles.overviewValue}>
                48
              </Text>
            </Card.Content>
          </Card>
        </View>
      </View>

      <Card style={styles.chartCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.chartTitle}>
            完成率趋势
          </Text>
          <LineChart
            data={weekData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      <Card style={styles.chartCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.chartTitle}>
            科目正确率分布
          </Text>
          <BarChart
            data={subjectData}
            width={screenWidth - 64}
            height={220}
            chartConfig={{
              ...chartConfig,
              decimalPlaces: 0,
            }}
            style={styles.chart}
            fromZero
          />
        </Card.Content>
      </Card>

      <Card style={styles.chartCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.chartTitle}>
            作业完成状态
          </Text>
          <PieChart
            data={pieData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      <Card style={styles.rankCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.chartTitle}>
            学习之星排行榜
          </Text>
          {topStudents.map((student) => (
            <View key={student.rank} style={styles.rankItem}>
              <View style={styles.rankInfo}>
                <View
                  style={[
                    styles.rankBadge,
                    {
                      backgroundColor:
                        student.rank === 1
                          ? '#ffd700'
                          : student.rank === 2
                          ? '#c0c0c0'
                          : student.rank === 3
                          ? '#cd7f32'
                          : '#e0e0e0',
                    },
                  ]}>
                  <Text
                    variant="bodyMedium"
                    style={styles.rankNumber}>
                    {student.rank}
                  </Text>
                </View>
                <Text variant="bodyMedium" style={styles.studentName}>
                  {student.name}
                </Text>
              </View>
              <View style={styles.rankStats}>
                <Chip compact style={styles.rankChip}>
                  正确率 {student.accuracy}%
                </Chip>
                <Chip compact style={[styles.rankChip, styles.completedChip]}>
                  完成 {student.completed}
                </Chip>
              </View>
            </View>
          ))}
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
  header: {
    backgroundColor: 'white',
    padding: 16,
    paddingTop: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  timeRangeSelector: {
    height: 40,
  },
  overviewSection: {
    padding: 16,
  },
  overviewCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overviewCard: {
    width: '48%',
    marginBottom: 12,
    elevation: 2,
  },
  overviewCard1: {
    borderLeftWidth: 4,
    borderLeftColor: '#6200ee',
  },
  overviewCard2: {
    borderLeftWidth: 4,
    borderLeftColor: '#03dac6',
  },
  overviewCard3: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  overviewCard4: {
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  overviewLabel: {
    color: '#666',
    marginBottom: 8,
  },
  overviewValue: {
    fontWeight: 'bold',
  },
  chartCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  rankCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  rankItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontWeight: 'bold',
    color: '#333',
  },
  studentName: {
    flex: 1,
  },
  rankStats: {
    flexDirection: 'row',
  },
  rankChip: {
    marginLeft: 8,
  },
  completedChip: {
    backgroundColor: '#e8f5e9',
  },
  bottomPadding: {
    height: 20,
  },
});

export default LearningStatsScreen;
