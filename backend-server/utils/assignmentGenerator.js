const db = require('../config/database');

/**
 * 知识点匹配算法
 * 根据学生年级、科目和知识点，匹配相应难度的题目
 */
async function matchKnowledgePoints(grade, subject, knowledgePoints, difficulty) {
  const difficultyLevels = {
    easy: 1,
    medium: 2,
    hard: 3
  };

  const targetDifficulty = difficultyLevels[difficulty] || 2;

  // 构建查询条件
  const conditions = [];
  const params = [];

  conditions.push('grade <= ?');
  params.push(grade);

  conditions.push('subject = ?');
  params.push(subject);

  if (knowledgePoints && knowledgePoints.length > 0) {
    conditions.push(`knowledge_point IN (${knowledgePoints.map(() => '?').join(',')})`);
    params.push(...knowledgePoints);
  }

  // 难度范围：目标难度 ±1
  const minDifficulty = Math.max(1, targetDifficulty - 1);
  const maxDifficulty = Math.min(3, targetDifficulty + 1);
  conditions.push('difficulty BETWEEN ? AND ?');
  params.push(minDifficulty, maxDifficulty);

  const whereClause = conditions.join(' AND ');

  const [questions] = await db.query(
    `SELECT * FROM question_bank WHERE ${whereClause} ORDER BY difficulty ASC LIMIT 100`,
    params
  );

  return questions;
}

/**
 * 剧情模板引擎
 * 根据主题生成密室逃脱/剧本杀风格的作业场景
 */
const storyTemplates = {
  default: {
    title: '知识大冒险',
    intro: '你被困在一个神秘的房间里，只有完成所有题目才能找到出口...',
    success: '恭喜你成功逃脱！所有知识都已掌握！',
    failure: '别灰心，再试一次就能找到钥匙！'
  },
  detective: {
    title: '名侦探学院',
    intro: '作为一个小侦探，你需要解开这些谜题才能找到真相...',
    success: '真相大白！你真是个出色的侦探！',
    failure: '线索就在眼前，再仔细想想！'
  },
  adventure: {
    title: '奇幻冒险岛',
    intro: '在冒险岛上，每个题目都是一道关卡，勇往直前吧！',
    success: '冒险成功！你成为了岛屿的英雄！',
    failure: '冒险家从不放弃，再来一次！'
  },
  space: {
    title: '太空探索',
    intro: '宇航员，完成这些任务才能返回地球...',
    success: '任务完成！欢迎回家，英雄！',
    failure: '燃料充足，再试一次就能返回！'
  }
};

/**
 * 作业生成器
 * 综合知识点匹配、难度控制和剧情模板，生成完整作业
 */
async function generateAssignment({ 
  subject, 
  knowledgePoints, 
  difficulty, 
  questionCount, 
  storyTheme = 'default',
  grade 
}) {
  // 1. 匹配知识点
  const matchedQuestions = await matchKnowledgePoints(
    grade, 
    subject, 
    knowledgePoints, 
    difficulty
  );

  if (matchedQuestions.length === 0) {
    throw new Error('未找到匹配的题目，请调整知识点或难度');
  }

  // 2. 选择题目（随机选择指定数量）
  const selectedQuestions = [];
  const availableQuestions = [...matchedQuestions];

  for (let i = 0; i < Math.min(questionCount, availableQuestions.length); i++) {
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    selectedQuestions.push(availableQuestions[randomIndex]);
    availableQuestions.splice(randomIndex, 1);
  }

  // 3. 获取剧情模板
  const template = storyTemplates[storyTheme] || storyTemplates.default;

  // 4. 格式化题目
  const formattedQuestions = selectedQuestions.map((q, index) => ({
    id: q.id,
    order: index + 1,
    type: q.question_type,
    content: q.question_content,
    options: q.options ? JSON.parse(q.options) : null,
    points: q.points || 10,
    difficulty: q.difficulty,
    knowledgePoint: q.knowledge_point,
    explanation: q.explanation
  }));

  // 5. 计算预估时间（每题平均 2 分钟）
  const estimatedTime = formattedQuestions.length * 2;

  // 6. 生成作业标题
  const title = `${template.title} - ${subject}${grade}年级`;

  return {
    title,
    subject,
    grade,
    storyTheme,
    story: {
      intro: template.intro,
      success: template.success,
      failure: template.failure
    },
    knowledgePoints,
    difficulty,
    questions: formattedQuestions,
    totalPoints: formattedQuestions.reduce((sum, q) => sum + q.points, 0),
    estimatedTime,
    createdAt: new Date().toISOString()
  };
}

/**
 * 难度匹配算法
 * 根据学生历史表现动态调整题目难度
 */
async function adjustDifficulty(studentId, currentDifficulty) {
  const difficultyLevels = {
    easy: 1,
    medium: 2,
    hard: 3
  };

  // 获取学生最近 10 次答题记录
  const [records] = await db.query(
    `SELECT correct, difficulty 
     FROM answers 
     WHERE student_id = ? 
     ORDER BY submitted_at DESC 
     LIMIT 10`,
    [studentId]
  );

  if (records.length < 5) {
    return currentDifficulty; // 数据不足，保持当前难度
  }

  const correctRate = records.filter(r => r.correct).length / records.length;
  const currentLevel = difficultyLevels[currentDifficulty];

  // 正确率 > 80%，提升难度
  if (correctRate > 0.8 && currentLevel < 3) {
    return Object.keys(difficultyLevels).find(
      key => difficultyLevels[key] === currentLevel + 1
    );
  }

  // 正确率 < 50%，降低难度
  if (correctRate < 0.5 && currentLevel > 1) {
    return Object.keys(difficultyLevels).find(
      key => difficultyLevels[key] === currentLevel - 1
    );
  }

  return currentDifficulty;
}

module.exports = {
  generateAssignment,
  matchKnowledgePoints,
  adjustDifficulty,
  storyTemplates
};
