/**
 * AI 路由 - 密室逃脱剧本生成
 * 提供剧本生成、题目生成、剧本查询等接口
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const llmService = require('../services/llmService');

// 简单的内存存储（生产环境应使用数据库）
const scriptStore = new Map();

/**
 * POST /api/ai/generate-script
 * 生成密室逃脱剧本
 * 
 * 请求体：
 * {
 *   theme: string,          // 主题（可选，默认：奇幻冒险）
 *   difficulty: string,     // 难度：easy|medium|hard（可选，默认：medium）
 *   timeLimit: number,      // 时长（分钟）（可选，默认：20）
 *   knowledgePoints: string,// 知识点（可选，默认：数学、逻辑推理）
 *   targetAge: string,      // 目标年龄（可选，默认：小学生）
 *   model: string           // 模型：qwen-plus|minimax（可选，默认：qwen-plus）
 * }
 */
router.post('/generate-script', [
  body('theme').optional().isString().trim(),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
  body('timeLimit').optional().isInt({ min: 5, max: 120 }),
  body('knowledgePoints').optional().isString().trim(),
  body('targetAge').optional().isString().trim(),
  body('model').optional().isIn(['qwen-plus', 'qwen-turbo', 'abab6.5'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      theme = '奇幻冒险',
      difficulty = 'medium',
      timeLimit = 20,
      knowledgePoints = '数学、逻辑推理',
      targetAge = '小学生',
      model = 'qwen-plus'
    } = req.body;

    console.log(`📝 开始生成剧本：主题=${theme}, 难度=${difficulty}, 时长=${timeLimit}分钟`);

    // 调用大模型生成剧本
    const script = await llmService.generateScript({
      theme,
      difficulty,
      timeLimit,
      knowledgePoints,
      targetAge
    });

    // 存储剧本
    scriptStore.set(script.id, script);

    console.log(`✅ 剧本生成成功：${script.id}, 场景数=${script.scenes?.length || 0}`);

    res.json({
      success: true,
      message: '剧本生成成功',
      data: {
        scriptId: script.id,
        theme: script.theme,
        difficulty: script.difficulty,
        timeLimit: script.time_limit,
        sceneCount: script.scenes?.length || 0,
        branchCount: script.branches?.length || 0,
        createdAt: script.createdAt
      }
    });
  } catch (error) {
    console.error('剧本生成失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '剧本生成失败',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * POST /api/ai/generate-questions
 * 生成题目
 * 
 * 请求体：
 * {
 *   knowledgePoints: string,  // 知识点（必填）
 *   count: number,            // 题目数量（可选，默认：5）
 *   difficulty: string,       // 难度：easy|medium|hard（可选，默认：medium）
 *   theme: string,            // 主题情境（可选）
 *   questionType: string      // 题型：choice|fill|match（可选，默认：choice）
 * }
 */
router.post('/generate-questions', [
  body('knowledgePoints').notEmpty().withMessage('知识点不能为空').isString().trim(),
  body('count').optional().isInt({ min: 1, max: 50 }),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
  body('theme').optional().isString().trim(),
  body('questionType').optional().isIn(['choice', 'fill', 'match', 'open'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      knowledgePoints,
      count = 5,
      difficulty = 'medium',
      theme = '通用',
      questionType = 'choice'
    } = req.body;

    console.log(`📝 开始生成题目：知识点=${knowledgePoints}, 数量=${count}, 难度=${difficulty}`);

    // 调用大模型生成题目
    const questions = await llmService.generateQuestions({
      knowledgePoints,
      count,
      difficulty,
      theme
    });

    console.log(`✅ 题目生成成功：共${questions.length}道题`);

    res.json({
      success: true,
      message: '题目生成成功',
      data: {
        count: questions.length,
        knowledgePoints,
        difficulty,
        questions
      }
    });
  } catch (error) {
    console.error('题目生成失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '题目生成失败',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * GET /api/ai/script/:id
 * 获取剧本详情
 * 
 * 路径参数：
 * - id: 剧本 ID
 */
router.get('/script/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const script = scriptStore.get(id);
    
    if (!script) {
      return res.status(404).json({
        success: false,
        message: '剧本不存在'
      });
    }

    res.json({
      success: true,
      data: script
    });
  } catch (error) {
    console.error('获取剧本失败:', error);
    res.status(500).json({
      success: false,
      message: '获取剧本失败',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * GET /api/ai/scripts
 * 获取所有剧本列表
 */
router.get('/scripts', async (req, res) => {
  try {
    const scripts = Array.from(scriptStore.values()).map(script => ({
      id: script.id,
      theme: script.theme,
      difficulty: script.difficulty,
      time_limit: script.time_limit,
      sceneCount: script.scenes?.length || 0,
      createdAt: script.createdAt
    }));

    res.json({
      success: true,
      data: {
        total: scripts.length,
        scripts
      }
    });
  } catch (error) {
    console.error('获取剧本列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取剧本列表失败',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * DELETE /api/ai/script/:id
 * 删除剧本
 */
router.delete('/script/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!scriptStore.has(id)) {
      return res.status(404).json({
        success: false,
        message: '剧本不存在'
      });
    }

    scriptStore.delete(id);

    res.json({
      success: true,
      message: '剧本已删除'
    });
  } catch (error) {
    console.error('删除剧本失败:', error);
    res.status(500).json({
      success: false,
      message: '删除剧本失败',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
