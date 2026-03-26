/**
 * AI API 测试脚本
 * 用于测试 AI 剧本生成功能
 * 
 * 使用方法:
 * 1. 确保后端服务已启动：npm start
 * 2. 运行测试：node test-ai-api.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/ai';

// 测试配置
const testConfig = {
  theme: '魔法学院',
  difficulty: 'medium',
  timeLimit: 25,
  knowledgePoints: '数学、逻辑推理',
  targetAge: '小学生'
};

/**
 * 测试生成剧本
 */
async function testGenerateScript() {
  console.log('\n📝 测试 1: 生成剧本');
  console.log('配置:', JSON.stringify(testConfig, null, 2));
  
  try {
    const response = await axios.post(`${BASE_URL}/generate-script`, testConfig);
    console.log('✅ 剧本生成成功!');
    console.log('响应:', JSON.stringify(response.data, null, 2));
    return response.data.data.scriptId;
  } catch (error) {
    console.error('❌ 剧本生成失败:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 测试生成题目
 */
async function testGenerateQuestions() {
  console.log('\n📝 测试 2: 生成题目');
  
  const config = {
    knowledgePoints: '一元一次方程',
    count: 5,
    difficulty: 'easy',
    theme: '魔法学院',
    questionType: 'choice'
  };
  
  console.log('配置:', JSON.stringify(config, null, 2));
  
  try {
    const response = await axios.post(`${BASE_URL}/generate-questions`, config);
    console.log('✅ 题目生成成功!');
    console.log(`生成题目数量：${response.data.data.count}`);
    if (response.data.data.questions && response.data.data.questions.length > 0) {
      console.log('第一题:', JSON.stringify(response.data.data.questions[0], null, 2));
    }
    return response.data;
  } catch (error) {
    console.error('❌ 题目生成失败:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 测试获取剧本详情
 */
async function testGetScript(scriptId) {
  console.log('\n📝 测试 3: 获取剧本详情');
  console.log('剧本 ID:', scriptId);
  
  try {
    const response = await axios.get(`${BASE_URL}/script/${scriptId}`);
    console.log('✅ 获取剧本成功!');
    console.log('主题:', response.data.data.theme);
    console.log('场景数:', response.data.data.scenes?.length || 0);
    console.log('分支数:', response.data.data.branches?.length || 0);
    return response.data;
  } catch (error) {
    console.error('❌ 获取剧本失败:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 测试获取剧本列表
 */
async function testGetScripts() {
  console.log('\n📝 测试 4: 获取剧本列表');
  
  try {
    const response = await axios.get(`${BASE_URL}/scripts`);
    console.log('✅ 获取剧本列表成功!');
    console.log('总数:', response.data.data.total);
    if (response.data.data.scripts.length > 0) {
      console.log('剧本列表:', JSON.stringify(response.data.data.scripts, null, 2));
    }
    return response.data;
  } catch (error) {
    console.error('❌ 获取剧本列表失败:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 主测试流程
 */
async function runTests() {
  console.log('🚀 开始 AI API 测试');
  console.log('API 地址:', BASE_URL);
  console.log('='.repeat(50));
  
  try {
    // 测试 1: 生成剧本
    const scriptId = await testGenerateScript();
    
    // 等待一下，确保数据已保存
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 测试 2: 生成题目
    await testGenerateQuestions();
    
    // 测试 3: 获取剧本详情
    await testGetScript(scriptId);
    
    // 测试 4: 获取剧本列表
    await testGetScripts();
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 所有测试通过!');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.log('\n' + '='.repeat(50));
    console.log('❌ 测试失败');
    console.log('='.repeat(50));
    process.exit(1);
  }
}

// 运行测试
runTests();
