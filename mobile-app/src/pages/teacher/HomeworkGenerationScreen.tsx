import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {
  Text,
  Card,
  Button,
  TextInput,
  Chip,
  SegmentedButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeworkGenerationScreen = () => {
  const [mode, setMode] = useState<'ai' | 'traditional'>('ai');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState('10');
  const [difficulty, setDifficulty] = useState('medium');
  const [aiPrompt, setAiPrompt] = useState('');
  const [generating, setGenerating] = useState(false);

  const subjects = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治'];
  const grades = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三', '高一', '高二', '高三'];
  const difficulties = [
    {label: '简单', value: 'easy'},
    {label: '中等', value: 'medium'},
    {label: '困难', value: 'hard'},
  ];

  const handleGenerate = async () => {
    if (!subject || !grade) {
      Alert.alert('提示', '请选择科目和年级');
      return;
    }

    setGenerating(true);
    
    // 模拟生成过程
    setTimeout(() => {
      setGenerating(false);
      Alert.alert('生成成功', '作业已生成并保存到草稿箱');
    }, 2000);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.title}>
          作业生成
        </Text>
      </View>

      <View style={styles.modeSelector}>
        <SegmentedButton
          value={mode}
          onValueChange={setMode}
          buttons={[
            {
              value: 'ai',
              label: 'AI 剧本生成',
              icon: 'auto-awesome',
            },
            {
              value: 'traditional',
              label: '传统作业',
              icon: 'assignment',
            },
          ]}
          style={styles.segmentedButton}
        />
      </View>

      <Card style={styles.formCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.formTitle}>
            基本信息
          </Text>

          <TextInput
            label="科目"
            value={subject}
            onChangeText={setSubject}
            style={styles.input}
            placeholder="例如：数学"
          />

          <TextInput
            label="年级"
            value={grade}
            onChangeText={setGrade}
            style={styles.input}
            placeholder="例如：三年级"
          />

          <TextInput
            label="知识点/主题"
            value={topic}
            onChangeText={setTopic}
            style={styles.input}
            multiline
            numberOfLines={2}
            placeholder="例如：分数的加减法"
          />

          <View style={styles.row}>
            <TextInput
              label="题目数量"
              value={questionCount}
              onChangeText={setQuestionCount}
              style={[styles.input, styles.halfInput]}
              keyboardType="number-pad"
            />
            <View style={[styles.input, styles.halfInput, styles.difficultySelector]}>
              <Text variant="bodyMedium" style={styles.difficultyLabel}>
                难度
              </Text>
              <View style={styles.chipContainer}>
                {difficulties.map((item) => (
                  <Chip
                    key={item.value}
                    selected={difficulty === item.value}
                    onPress={() => setDifficulty(item.value)}
                    style={styles.chip}
                    textStyle={styles.chipText}>
                    {item.label}
                  </Chip>
                ))}
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {mode === 'ai' && (
        <Card style={styles.formCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.formTitle}>
              AI 剧本设置
            </Text>

            <TextInput
              label="剧本主题"
              value={aiPrompt}
              onChangeText={setAiPrompt}
              style={styles.input}
              multiline
              numberOfLines={3}
              placeholder="描述你想要的剧本场景，例如：太空探险、古代宫廷、侦探推理..."
            />

            <View style={styles.aiFeatures}>
              <View style={styles.aiFeature}>
                <Icon name="psychology" size={24} color="#6200ee" />
                <View style={styles.aiFeatureText}>
                  <Text variant="titleSmall">智能生成</Text>
                  <Text variant="bodySmall">
                    根据主题自动生成故事情节和题目
                  </Text>
                </View>
              </View>
              <View style={styles.aiFeature}>
                <Icon name="emoji-events" size={24} color="#6200ee" />
                <View style={styles.aiFeatureText}>
                  <Text variant="titleSmall">游戏化设计</Text>
                  <Text variant="bodySmall">
                    融入密室逃脱、剧本杀元素
                  </Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      <Button
        mode="contained"
        onPress={handleGenerate}
        style={styles.generateButton}
        loading={generating}
        icon="magic-button">
        {mode === 'ai' ? 'AI 生成剧本作业' : '生成传统作业'}
      </Button>

      <View style={styles.historySection}>
        <Text variant="titleMedium" style={styles.historyTitle}>
          最近生成
        </Text>
        <Card style={styles.historyCard}>
          <Card.Content>
            <View style={styles.historyItem}>
              <View>
                <Text variant="titleSmall">三年级数学 - 分数运算</Text>
                <Text variant="bodySmall" style={styles.historyDate}>
                  2024-01-15 14:30
                </Text>
              </View>
              <Chip textStyle={styles.statusChip}>已完成</Chip>
            </View>
          </Card.Content>
        </Card>
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
    padding: 16,
    paddingTop: 20,
  },
  title: {
    fontWeight: 'bold',
  },
  modeSelector: {
    padding: 16,
  },
  segmentedButton: {
    height: 48,
  },
  formCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  formTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  difficultySelector: {
    justifyContent: 'center',
  },
  difficultyLabel: {
    marginBottom: 8,
    color: '#666',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginBottom: 4,
  },
  chipText: {
    fontSize: 12,
  },
  aiFeatures: {
    marginTop: 8,
  },
  aiFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  aiFeatureText: {
    marginLeft: 12,
    flex: 1,
  },
  generateButton: {
    margin: 16,
    paddingVertical: 8,
  },
  historySection: {
    padding: 16,
    paddingTop: 0,
  },
  historyTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  historyCard: {
    marginBottom: 8,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyDate: {
    color: '#666',
    marginTop: 4,
  },
  statusChip: {
    fontSize: 12,
  },
});

export default HomeworkGenerationScreen;
