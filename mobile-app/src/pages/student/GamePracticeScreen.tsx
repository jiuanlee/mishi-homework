import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Chip,
  ProgressBar,
  IconButton,
  Dialog,
  Portal,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRoute, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StudentStackParamList} from '../../navigation/AppNavigator';
import {useHomeworkStore} from '../../store/homeworkStore';

const {width, height} = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<StudentStackParamList>;

const GamePracticeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const {homeworkId} = route.params as {homeworkId?: string};
  const {getHomeworkById, submitHomework} = useHomeworkStore();

  const [gameMode, setGameMode] = useState<'escape' | 'mystery' | 'normal'>('normal');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const homework = homeworkId ? getHomeworkById(homeworkId) : null;

  // 模拟题目数据
  const questions = [
    {
      id: 1,
      question: '一个分数的分子是 3，分母是 4，这个分数是多少？',
      options: ['3/4', '4/3', '1/4', '3/5'],
      correct: '3/4',
      hint: '分子在上，分母在下',
      story: '你被困在一个密室里，墙上刻着一道数学题...',
    },
    {
      id: 2,
      question: '1/2 + 1/4 = ?',
      options: ['3/4', '2/6', '1/6', '3/8'],
      correct: '3/4',
      hint: '先通分，再相加',
      story: '打开第一扇门后，你来到了一个神秘的房间...',
    },
    {
      id: 3,
      question: '3/5 - 1/5 = ?',
      options: ['2/5', '4/5', '2/10', '1/5'],
      correct: '2/5',
      hint: '分母相同，分子相减',
      story: '最后的挑战！解开这道题就能逃脱！',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0 && !showResult) {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setAnswers({...answers, [currentQuestion]: answer});
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowHint(false);
    } else {
      calculateScore();
      setShowResult(true);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        correctCount++;
      }
    });
    const baseScore = (correctCount / questions.length) * 100;
    const timeBonus = Math.floor(timeLeft / 10);
    const hintPenalty = hintsUsed * 5;
    setScore(Math.min(100, baseScore + timeBonus - hintPenalty));
  };

  const handleSubmit = () => {
    if (homeworkId) {
      submitHomework(homeworkId, score);
    }
    navigation.navigate('StudentHome');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentQuestion];
  const progress = (currentQuestion + 1) / questions.length;

  return (
    <View style={styles.container}>
      {/* 顶部状态栏 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          <Text variant="titleMedium" style={styles.headerTitle}>
            {gameMode === 'escape' ? '密室逃脱' : gameMode === 'mystery' ? '剧本杀' : '做题模式'}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.timerBadge, timeLeft < 60 && styles.timerWarning]}>
            <Icon name="timer" size={18} color={timeLeft < 60 ? '#f44336' : '#6200ee'} />
            <Text variant="bodyMedium" style={styles.timerText}>
              {formatTime(timeLeft)}
            </Text>
          </View>
        </View>
      </View>

      {/* 进度条 */}
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} color="#6200ee" style={styles.progressBar} />
        <Text variant="bodySmall" style={styles.progressText}>
          第 {currentQuestion + 1} / {questions.length} 题
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 剧情文本 */}
        {gameMode !== 'normal' && (
          <Card style={styles.storyCard}>
            <Card.Content>
              <View style={styles.storyHeader}>
                <Icon name="menu-book" size={24} color="#6200ee" />
                <Text variant="titleSmall" style={styles.storyTitle}>
                  剧情
                </Text>
              </View>
              <Text variant="bodyMedium" style={styles.storyText}>
                {currentQ.story}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* 题目卡片 */}
        <Card style={styles.questionCard}>
          <Card.Content>
            <View style={styles.questionHeader}>
              <Chip icon="help-outline" compact style={styles.questionChip}>
                单选题
              </Chip>
              <IconButton
                icon={showHint ? 'lightbulb-on' : 'lightbulb-outline'}
                onPress={() => setShowHint(!showHint)}
                iconColor="#ff9800"
              />
            </View>
            <Text variant="titleMedium" style={styles.questionText}>
              {currentQ.question}
            </Text>

            {showHint && (
              <View style={styles.hintBox}>
                <Icon name="lightbulb" size={20} color="#ff9800" />
                <Text variant="bodyMedium" style={styles.hintText}>
                  提示：{currentQ.hint}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* 选项 */}
        <View style={styles.optionsContainer}>
          {currentQ.options.map((option, index) => (
            <Card
              key={index}
              style={[
                styles.optionCard,
                selectedAnswer === option && styles.selectedOption,
                answers[currentQuestion] === option &&
                  option === currentQ.correct &&
                  styles.correctOption,
                answers[currentQuestion] === option &&
                  option !== currentQ.correct &&
                  styles.wrongOption,
              ]}
              onPress={() => handleAnswer(option)}>
              <Card.Content style={styles.optionContent}>
                <View
                  style={[
                    styles.optionLetter,
                    selectedAnswer === option && styles.selectedLetter,
                  ]}>
                  <Text variant="bodyMedium" style={styles.letterText}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text variant="bodyLarge" style={styles.optionText}>
                  {option}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={() => setHintsUsed(hintsUsed + 1)}
          icon="lightbulb"
          style={styles.hintButton}>
          使用提示 ({hintsUsed})
        </Button>
        <Button
          mode="contained"
          onPress={handleNext}
          disabled={!selectedAnswer}
          style={styles.nextButton}
          icon={currentQuestion < questions.length - 1 ? 'arrow-forward' : 'check'}>
          {currentQuestion < questions.length - 1 ? '下一题' : '提交'}
        </Button>
      </View>

      {/* 结果弹窗 */}
      <Portal>
        <Dialog visible={showResult} onDismiss={() => {}}>
          <Dialog.Title style={styles.resultTitle}>
            {score >= 80 ? '🎉 太棒了！' : score >= 60 ? '👍 不错哦！' : '💪 继续加油！'}
          </Dialog.Title>
          <Dialog.Content>
            <View style={styles.resultContent}>
              <View style={styles.scoreCircle}>
                <Text variant="headlineLarge" style={styles.scoreValue}>
                  {score}
                </Text>
                <Text variant="bodySmall" style={styles.scoreLabel}>
                  总分
                </Text>
              </View>
              <View style={styles.resultStats}>
                <View style={styles.resultStat}>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    用时
                  </Text>
                  <Text variant="titleMedium">{formatTime(300 - timeLeft)}</Text>
                </View>
                <View style={styles.resultStat}>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    提示
                  </Text>
                  <Text variant="titleMedium">{hintsUsed} 次</Text>
                </View>
              </View>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleSubmit} mode="contained">
              完成
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingTop: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  timerWarning: {
    backgroundColor: '#ffebee',
  },
  timerText: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: 'white',
    paddingBottom: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 4,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  storyCard: {
    marginBottom: 16,
    backgroundColor: '#f3e5f5',
    borderLeftWidth: 4,
    borderLeftColor: '#6200ee',
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  storyTitle: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  storyText: {
    color: '#4a148c',
    lineHeight: 24,
  },
  questionCard: {
    marginBottom: 16,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionChip: {
    backgroundColor: '#e3f2fd',
  },
  questionText: {
    fontWeight: 'bold',
    lineHeight: 28,
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  hintText: {
    marginLeft: 8,
    color: '#e65100',
    flex: 1,
  },
  optionsContainer: {
    marginBottom: 80,
  },
  optionCard: {
    marginBottom: 12,
    elevation: 1,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#6200ee',
    backgroundColor: '#ede7f6',
  },
  correctOption: {
    borderWidth: 2,
    borderColor: '#4caf50',
    backgroundColor: '#e8f5e9',
  },
  wrongOption: {
    borderWidth: 2,
    borderColor: '#f44336',
    backgroundColor: '#ffebee',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedLetter: {
    backgroundColor: '#6200ee',
  },
  letterText: {
    fontWeight: 'bold',
  },
  optionText: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  hintButton: {
    flex: 1,
    marginRight: 8,
  },
  nextButton: {
    flex: 2,
  },
  resultTitle: {
    textAlign: 'center',
    fontSize: 24,
  },
  resultContent: {
    alignItems: 'center',
    padding: 20,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreValue: {
    color: 'white',
    fontWeight: 'bold',
  },
  scoreLabel: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  resultStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  resultStat: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#666',
    marginBottom: 4,
  },
});

export default GamePracticeScreen;
