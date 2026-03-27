/**
 * 大模型服务 - 集成 Bailian、GLM 和 MiniMax API
 * 支持多种模型：通义千问、智谱 GLM、MiniMax
 */

const axios = require('axios');

class LLMService {
  constructor() {
    // Bailian (通义千问) 配置
    this.bailianApiKey = process.env.BAILIAN_API_KEY;
    this.bailianBaseUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1';
    
    // GLM (智谱 AI) 配置
    this.glmApiKey = process.env.GLM_API_KEY;
    this.glmBaseUrl = 'https://open.bigmodel.cn/api/paas/v4';
    
    // MiniMax 配置
    this.minimaxApiKey = process.env.MINIMAX_API_KEY;
    this.minimaxGroupId = process.env.MINIMAX_GROUP_ID;
    this.minimaxBaseUrl = 'https://api.minimax.chat/v1';
    
    // 默认模型
    this.defaultModel = 'qwen3.5-plus'; // 通义千问 3.5
  }

  /**
   * 调用大模型生成内容
   * @param {string} prompt - 提示词
   * @param {object} options - 选项
   * @param {string} options.model - 模型名称
   * @param {string} options.provider - 提供商 (bailian|minimax)
   * @param {number} options.temperature - 温度
   * @param {number} options.maxTokens - 最大 token 数
   * @param {boolean} options.stream - 是否流式输出
   * @returns {Promise<string>} - 生成的内容
   */
  async generate(prompt, options = {}) {
    const {
      model = this.defaultModel,
      provider = 'bailian',
      temperature = 0.7,
      maxTokens = 4096,
      stream = false
    } = options;

    try {
      if (provider === 'bailian') {
        return await this._callBailian(prompt, { model, temperature, maxTokens, stream });
      } else if (provider === 'glm') {
        return await this._callGLM(prompt, { model, temperature, maxTokens, stream });
      } else if (provider === 'minimax') {
        return await this._callMinimax(prompt, { model, temperature, maxTokens, stream });
      } else {
        throw new Error(`不支持的提供商：${provider}`);
      }
    } catch (error) {
      console.error('大模型调用失败:', error.response?.data || error.message);
      throw new Error(`大模型调用失败：${error.message}`);
    }
  }

  /**
   * 调用 Bailian API
   */
  async _callBailian(prompt, options) {
    const { model, temperature, maxTokens, stream } = options;

    const response = await axios.post(
      `${this.bailianBaseUrl}/chat/completions`,
      {
        model: model,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的密室逃脱游戏设计师，擅长创作有趣、教育性强的剧本。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: temperature,
        max_tokens: maxTokens,
        stream: stream,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${this.bailianApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    if (stream) {
      return response.data; // 流式数据
    }

    return response.data.choices[0]?.message?.content || '';
  }

  /**
   * 调用 GLM (智谱 AI) API
   */
  async _callGLM(prompt, options) {
    const { model, temperature, maxTokens, stream } = options;

    const response = await axios.post(
      `${this.glmBaseUrl}/chat/completions`,
      {
        model: model || 'glm-4',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的密室逃脱游戏设计师，擅长创作有趣、教育性强的剧本。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: temperature,
        max_tokens: maxTokens,
        stream: stream
      },
      {
        headers: {
          'Authorization': `Bearer ${this.glmApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    if (stream) {
      return response.data; // 流式数据
    }

    return response.data.choices[0]?.message?.content || '';
  }

  /**
   * 调用 MiniMax API
   */
  async _callMinimax(prompt, options) {
    const { model, temperature, maxTokens, stream } = options;

    const response = await axios.post(
      `${this.minimaxBaseUrl}/text/chatcompletion_v2`,
      {
        model: model || 'abab6.5',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的密室逃脱游戏设计师，擅长创作有趣、教育性强的剧本。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: temperature,
        max_tokens: maxTokens,
        stream: stream
      },
      {
        headers: {
          'Authorization': `Bearer ${this.minimaxApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    if (stream) {
      return response.data;
    }

    return response.data.choices[0]?.message?.content || '';
  }

  /**
   * 生成密室逃脱剧本
   * @param {object} params - 参数
   * @param {string} params.theme - 主题
   * @param {string} params.difficulty - 难度 (easy|medium|hard)
   * @param {number} params.timeLimit - 时长 (分钟)
   * @param {string} params.knowledgePoints - 知识点
   * @param {string} params.targetAge - 目标年龄
   * @returns {Promise<object>} - 生成的剧本
   */
  async generateScript(params) {
    const promptTemplate = require('fs').readFileSync(
      require('path').join(__dirname, '../prompts/script-generator.md'),
      'utf-8'
    );

    const prompt = promptTemplate
      .replace('{{theme}}', params.theme || '奇幻冒险')
      .replace('{{difficulty}}', params.difficulty || 'medium')
      .replace('{{timeLimit}}', params.timeLimit || 20)
      .replace('{{knowledgePoints}}', params.knowledgePoints || '数学、逻辑推理')
      .replace('{{targetAge}}', params.targetAge || '小学生');

    const response = await this.generate(prompt, {
      model: 'qwen3.5-plus',  // 通义千问 3.5
      provider: 'bailian',
      temperature: 0.8,
      maxTokens: 8192
    });

    // 解析 JSON 响应
    try {
      // 清理可能的 markdown 标记
      const cleanedResponse = response.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const script = JSON.parse(cleanedResponse);
      
      // 添加元数据
      script.id = Date.now().toString();
      script.createdAt = new Date().toISOString();
      script.status = 'active';
      
      return script;
    } catch (error) {
      console.error('剧本 JSON 解析失败:', error);
      throw new Error('剧本生成成功但格式解析失败，请重试');
    }
  }

  /**
   * 生成题目
   * @param {object} params - 参数
   * @param {string} params.knowledgePoints - 知识点
   * @param {number} params.count - 题目数量
   * @param {string} params.difficulty - 难度
   * @param {string} params.theme - 主题（用于情境化题目）
   * @returns {Promise<Array>} - 生成的题目列表
   */
  async generateQuestions(params) {
    const prompt = `
你是一位教育专家，需要根据以下要求生成题目：

**要求：**
- 知识点：${params.knowledgePoints || '数学、逻辑推理'}
- 题目数量：${params.count || 5}
- 难度：${params.difficulty || 'medium'}
- 主题情境：${params.theme || '通用'}

**输出格式（JSON）：**
{
  "questions": [
    {
      "id": 1,
      "type": "choice",
      "question": "题目内容",
      "options": ["A. 选项 1", "B. 选项 2", "C. 选项 3", "D. 选项 4"],
      "answer": "A",
      "explanation": "答案解析",
      "difficulty": "easy",
      "knowledgePoint": "具体知识点"
    }
  ]
}

请生成符合要求的题目，确保题目有趣且贴合主题情境。
`;

    const response = await this.generate(prompt, {
      model: 'qwen-plus',
      provider: 'bailian',
      temperature: 0.7,
      maxTokens: 4096
    });

    try {
      const cleanedResponse = response.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const data = JSON.parse(cleanedResponse);
      
      // 为每个题目添加唯一 ID
      data.questions = data.questions.map((q, index) => ({
        ...q,
        id: `q_${Date.now()}_${index}`,
        createdAt: new Date().toISOString()
      }));
      
      return data.questions;
    } catch (error) {
      console.error('题目 JSON 解析失败:', error);
      throw new Error('题目生成成功但格式解析失败，请重试');
    }
  }

  /**
   * 流式生成（用于实时输出）
   * @param {string} prompt - 提示词
   * @param {function} onChunk - 数据块回调
   * @returns {Promise<string>} - 完整响应
   */
  async generateStream(prompt, onChunk) {
    const response = await this.generate(prompt, {
      stream: true,
      model: 'qwen-plus',
      provider: 'bailian'
    });

    // 处理流式响应（具体实现取决于 API 返回格式）
    let fullContent = '';
    
    // 注意：实际的流式处理需要根据 API 的具体返回格式调整
    // 这里提供一个通用的处理框架
    if (response.choices && response.choices[0]?.delta?.content) {
      const chunk = response.choices[0].delta.content;
      fullContent += chunk;
      onChunk(chunk);
    }

    return fullContent;
  }
}

module.exports = new LLMService();
