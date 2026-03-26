import api from './index';

export interface LoginParams {
  phone: string;
  code: string;
}

export interface RegisterParams {
  phone: string;
  code: string;
  teacherName: string;
  schoolName: string;
}

export interface StudentLoginParams {
  classCode: string;
  name: string;
}

// 老师登录
export const teacherLogin = async (params: LoginParams) => {
  const response = await api.post('/auth/teacher/login', params);
  return response.data;
};

// 老师注册
export const teacherRegister = async (params: RegisterParams) => {
  const response = await api.post('/auth/teacher/register', params);
  return response.data;
};

// 发送验证码
export const sendCode = async (phone: string) => {
  const response = await api.post('/auth/send-code', {phone});
  return response.data;
};

// 学生登录
export const studentLogin = async (params: StudentLoginParams) => {
  const response = await api.post('/auth/student/login', params);
  return response.data;
};

// 获取班级列表
export const getClassList = async () => {
  const response = await api.get('/classes');
  return response.data;
};

// 创建班级
export const createClass = async (name: string) => {
  const response = await api.post('/classes', {name});
  return response.data;
};

// 获取班级详情
export const getClassDetail = async (classId: string) => {
  const response = await api.get(`/classes/${classId}`);
  return response.data;
};

// 添加学生到班级
export const addStudentToClass = async (classId: string, studentName: string) => {
  const response = await api.post(`/classes/${classId}/students`, {
    name: studentName,
  });
  return response.data;
};

// 获取作业列表
export const getHomeworkList = async (classId?: string) => {
  const params = classId ? {classId} : {};
  const response = await api.get('/homeworks', {params});
  return response.data;
};

// 创建作业
export const createHomework = async (data: any) => {
  const response = await api.post('/homeworks', data);
  return response.data;
};

// AI 生成作业
export const generateAIHomework = async (data: any) => {
  const response = await api.post('/homeworks/generate-ai', data);
  return response.data;
};

// 获取作业详情
export const getHomeworkDetail = async (homeworkId: string) => {
  const response = await api.get(`/homeworks/${homeworkId}`);
  return response.data;
};

// 提交作业
export const submitHomework = async (homeworkId: string, answers: any) => {
  const response = await api.post(`/homeworks/${homeworkId}/submit`, {answers});
  return response.data;
};

// 获取学情统计
export const getLearningStats = async (classId: string) => {
  const response = await api.get(`/classes/${classId}/stats`);
  return response.data;
};

// 获取学生详情
export const getStudentDetail = async (studentId: string) => {
  const response = await api.get(`/students/${studentId}`);
  return response.data;
};

// 获取错题本
export const getWrongQuestions = async (studentId: string) => {
  const response = await api.get(`/students/${studentId}/wrong-questions`);
  return response.data;
};
