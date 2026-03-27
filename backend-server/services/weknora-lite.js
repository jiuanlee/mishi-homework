/**
 * WeKnora 知识库轻量级集成
 * 无需 Docker，直接调用 WeKnora API
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

class WeKnoraLiteService {
  constructor() {
    this.baseUrl = process.env.WEKNORA_BASE_URL || 'http://localhost:8080/api/v1';
    this.apiKey = process.env.WEKNORA_API_KEY || '';
    this.enabled = !!this.apiKey;
  }

  /**
   * 创建知识库
   */
  async createKnowledgeBase(name, description) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/knowledge-base`,
        { name, description },
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('WeKnora 创建知识库失败:', error.message);
      throw error;
    }
  }

  /**
   * 上传文档
   */
  async uploadDocument(knowledgeBaseId, filePath, fileName) {
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));
      formData.append('fileName', fileName);

      const response = await axios.post(
        `${this.baseUrl}/knowledge/upload`,
        formData,
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'multipart/form-data'
          },
          params: { knowledgeBaseId }
        }
      );
      return response.data;
    } catch (error) {
      console.error('WeKnora 上传文档失败:', error.message);
      throw error;
    }
  }

  /**
   * 搜索知识库
   */
  async searchKnowledge(knowledgeBaseId, query, limit = 5) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/knowledge/search`,
        { query, knowledgeBaseId, limit },
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('WeKnora 搜索失败:', error.message);
      throw error;
    }
  }

  /**
   * 基于知识库问答
   */
  async chat(knowledgeBaseId, message, sessionId) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat`,
        { knowledgeBaseId, message, sessionId },
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('WeKnora 问答失败:', error.message);
      throw error;
    }
  }

  /**
   * 获取知识库列表
   */
  async getKnowledgeBases(page = 1, pageSize = 10) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/knowledge-base`,
        {
          headers: { 'X-API-Key': this.apiKey },
          params: { page, pageSize }
        }
      );
      return response.data;
    } catch (error) {
      console.error('WeKnora 获取知识库列表失败:', error.message);
      throw error;
    }
  }
}

module.exports = WeKnoraLiteService;
