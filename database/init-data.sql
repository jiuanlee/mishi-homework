-- 密室做题家数据库初始化脚本
-- 创建数据库和表结构，并插入初始数据

-- 创建数据库
CREATE DATABASE IF NOT EXISTS escape_room_solver 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE escape_room_solver;

-- ==================== 用户表 ====================
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  role ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== 班级表 ====================
CREATE TABLE classes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  grade ENUM('1', '2', '3', '4', '5', '6') NOT NULL,
  description TEXT,
  teacher_id INT NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_grade (grade),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== 班级学生关联表 ====================
CREATE TABLE class_students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  class_id INT NOT NULL,
  student_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_class_student (class_id, student_id),
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== 作业表 ====================
CREATE TABLE assignments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  class_id INT NOT NULL,
  teacher_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  subject ENUM('语文', '数学', '英语', '科学') NOT NULL,
  knowledge_points JSON,
  difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
  question_count INT NOT NULL,
  story_theme VARCHAR(50) DEFAULT 'default',
  time_limit INT DEFAULT 30 COMMENT '时间限制（分钟）',
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  questions JSON NOT NULL COMMENT '题目内容',
  due_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_class (class_id),
  INDEX idx_subject (subject),
  INDEX idx_status (status),
  INDEX idx_teacher (teacher_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== 题目库表 ====================
CREATE TABLE question_bank (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subject ENUM('语文', '数学', '英语', '科学') NOT NULL,
  grade ENUM('1', '2', '3', '4', '5', '6') NOT NULL,
  knowledge_point VARCHAR(100) NOT NULL,
  question_type ENUM('single_choice', 'multiple_choice', 'fill_blank', 'true_false') NOT NULL,
  question_content TEXT NOT NULL,
  options JSON COMMENT '选项（选择题）',
  correct_answer TEXT NOT NULL,
  explanation TEXT COMMENT '答案解析',
  difficulty INT NOT NULL DEFAULT 2 COMMENT '1-简单，2-中等，3-困难',
  points INT DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_subject_grade (subject, grade),
  INDEX idx_knowledge_point (knowledge_point),
  INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== 答题记录表 ====================
CREATE TABLE answers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  assignment_id INT NOT NULL,
  student_id INT NOT NULL,
  question_id INT NOT NULL,
  student_answer TEXT NOT NULL,
  correct BOOLEAN NOT NULL,
  points INT DEFAULT 0,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES question_bank(id) ON DELETE CASCADE,
  INDEX idx_assignment (assignment_id),
  INDEX idx_student (student_id),
  INDEX idx_submitted (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== 学生进度表 ====================
CREATE TABLE student_progress (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  assignment_id INT NOT NULL,
  correct_rate DECIMAL(5,2) DEFAULT 0,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_student_assignment (student_id, assignment_id),
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  INDEX idx_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== 剧情模板表 ====================
CREATE TABLE story_templates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  theme_name VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(100) NOT NULL,
  intro TEXT NOT NULL,
  success TEXT NOT NULL,
  failure TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================== 插入初始数据 ====================

-- 插入管理员账户（密码：admin123）
INSERT INTO users (username, password, email, role) VALUES 
('admin', '$2a$10$X7v8YqZJxKqKqKqKqKqKqOZJxKqKqKqKqKqKqKqKqKqKqKqKq', 'admin@example.com', 'admin');

-- 插入教师账户（密码：teacher123）
INSERT INTO users (username, password, email, role) VALUES 
('teacher1', '$2a$10$Y8w9ZrAKyLrLrLrLrLrLrPAKyLrLrLrLrLrLrLrLrLrLrLrLr', 'teacher1@example.com', 'teacher'),
('teacher2', '$2a$10$Z9x0AsBLzMsMsMsMsMsMsQBLzMsMsMsMsMsMsMsMsMsMsMsMs', 'teacher2@example.com', 'teacher');

-- 插入学生账户（密码：student123）
INSERT INTO users (username, password, email, role) VALUES 
('student1', '$2a$10$A0y1BtCM0NtNtNtNtNtNtRCM0NtNtNtNtNtNtNtNtNtNtNtNt', 'student1@example.com', 'student'),
('student2', '$2a$10$B1z2CuDN1OuOuOuOuOuOuSDN1OuOuOuOuOuOuOuOuOuOuOuOu', 'student2@example.com', 'student'),
('student3', '$2a$10$C2A3DvEO2PvPvPvPvPvPvTEO2PvPvPvPvPvPvPvPvPvPvPvPv', 'student3@example.com', 'student');

-- 插入班级
INSERT INTO classes (name, grade, description, teacher_id, status) VALUES
('三年级一班', '3', '快乐学习的班级', 2, 'active'),
('四年级二班', '4', '积极向上的班级', 3, 'active'),
('五年级一班', '5', '追求卓越的班级', 2, 'active');

-- 插入班级学生
INSERT INTO class_students (class_id, student_id) VALUES
(1, 4), (1, 5), (1, 6),
(2, 4), (2, 5),
(3, 6);

-- 插入剧情模板
INSERT INTO story_templates (theme_name, title, intro, success, failure) VALUES
('default', '知识大冒险', '你被困在一个神秘的房间里，只有完成所有题目才能找到出口...', '恭喜你成功逃脱！所有知识都已掌握！', '别灰心，再试一次就能找到钥匙！'),
('detective', '名侦探学院', '作为一个小侦探，你需要解开这些谜题才能找到真相...', '真相大白！你真是个出色的侦探！', '线索就在眼前，再仔细想想！'),
('adventure', '奇幻冒险岛', '在冒险岛上，每个题目都是一道关卡，勇往直前吧！', '冒险成功！你成为了岛屿的英雄！', '冒险家从不放弃，再来一次！'),
('space', '太空探索', '宇航员，完成这些任务才能返回地球...', '任务完成！欢迎回家，英雄！', '燃料充足，再试一次就能返回！');

-- ==================== 插入示例题目 ====================

-- 数学题目（1-3 年级）
INSERT INTO question_bank (subject, grade, knowledge_point, question_type, question_content, options, correct_answer, explanation, difficulty) VALUES
('数学', '1', '加法运算', 'single_choice', '5 + 3 = ?', JSON_ARRAY('6', '7', '8', '9'), '8', '5 加 3 等于 8', 1),
('数学', '1', '减法运算', 'single_choice', '10 - 4 = ?', JSON_ARRAY('5', '6', '7', '8'), '6', '10 减 4 等于 6', 1),
('数学', '2', '乘法运算', 'single_choice', '3 × 4 = ?', JSON_ARRAY('10', '11', '12', '13'), '12', '3 乘以 4 等于 12', 1),
('数学', '2', '除法运算', 'single_choice', '15 ÷ 3 = ?', JSON_ARRAY('4', '5', '6', '7'), '5', '15 除以 3 等于 5', 2),
('数学', '3', '混合运算', 'single_choice', '(5 + 3) × 2 = ?', JSON_ARRAY('14', '15', '16', '17'), '16', '先算括号内 5+3=8，再乘以 2 得 16', 2),
('数学', '3', '分数', 'single_choice', '1/2 + 1/2 = ?', JSON_ARRAY('1/4', '1/2', '1', '2'), '1', '两个二分之一相加等于 1', 3);

-- 语文题目（1-3 年级）
INSERT INTO question_bank (subject, grade, knowledge_point, question_type, question_content, options, correct_answer, explanation, difficulty) VALUES
('语文', '1', '拼音', 'single_choice', '"苹果"的拼音是？', JSON_ARRAY('píng guǒ', 'pīn guǒ', 'píng gǒ', 'pīn gǒ'), 'píng guǒ', '苹果的拼音是 píng guǒ', 1),
('语文', '1', '汉字', 'single_choice', '下面哪个字是"大"的反义词？', JSON_ARRAY('小', '多', '高', '长'), '小', '大的反义词是小', 1),
('语文', '2', '词语', 'single_choice', '"高兴"的近义词是？', JSON_ARRAY('快乐', '伤心', '生气', '害怕'), '快乐', '高兴和快乐意思相近', 1),
('语文', '2', '古诗', 'fill_blank', '床前明月光，疑是地上___。', NULL, '霜', '出自李白《静夜思》', 2),
('语文', '3', '成语', 'single_choice', '"画蛇添足"的意思是？', JSON_ARRAY('多此一举', '认真负责', '勤劳勇敢', '聪明机智'), '多此一举', '画蛇添足比喻做了多余的事', 2),
('语文', '3', '阅读理解', 'multiple_choice', '下面哪些是描写春天的词语？', JSON_ARRAY('春暖花开', '烈日炎炎', '百花齐放', '大雪纷飞'), '["春暖花开", "百花齐放"]', '春暖花开和百花齐放都是描写春天的', 3);

-- 英语题目（3-6 年级）
INSERT INTO question_bank (subject, grade, knowledge_point, question_type, question_content, options, correct_answer, explanation, difficulty) VALUES
('英语', '3', '单词', 'single_choice', 'Apple 的中文意思是？', JSON_ARRAY('香蕉', '苹果', '橙子', '葡萄'), '苹果', 'Apple 是苹果的意思', 1),
('英语', '3', '问候语', 'single_choice', '早上见面应该说？', JSON_ARRAY('Good night', 'Good morning', 'Goodbye', 'Hello'), 'Good morning', '早上好是 Good morning', 1),
('英语', '4', '语法', 'single_choice', 'I ___ a student.', JSON_ARRAY('am', 'is', 'are', 'be'), 'am', 'I 后面用 am', 2),
('英语', '4', '时态', 'single_choice', 'She ___ to school every day.', JSON_ARRAY('go', 'goes', 'going', 'went'), 'goes', '第三人称单数用 goes', 2),
('英语', '5', '阅读理解', 'multiple_choice', 'Which are fruits?', JSON_ARRAY('Apple', 'Carrot', 'Banana', 'Potato'), '["Apple", "Banana"]', 'Apple 和 Banana 是水果', 3);

-- 科学题目（3-6 年级）
INSERT INTO question_bank (subject, grade, knowledge_point, question_type, question_content, options, correct_answer, explanation, difficulty) VALUES
('科学', '3', '植物', 'single_choice', '植物生长需要哪些条件？', JSON_ARRAY('阳光', '水', '空气', '以上都是'), '以上都是', '植物生长需要阳光、水和空气', 1),
('科学', '3', '动物', 'true_false', '青蛙是两栖动物。', NULL, 'true', '青蛙既可以在水中生活，也可以在陆地上生活', 1),
('科学', '4', '太阳系', 'single_choice', '地球是太阳系中的第几颗行星？', JSON_ARRAY('第一颗', '第二颗', '第三颗', '第四颗'), '第三颗', '地球是太阳系第三颗行星', 2),
('科学', '4', '物质状态', 'single_choice', '水在 0°C 时会变成什么状态？', JSON_ARRAY('液态', '固态', '气态', '等离子态'), '固态', '水在 0°C 时会结冰变成固态', 2),
('科学', '5', '生态系统', 'multiple_choice', '下面哪些是生产者？', JSON_ARRAY('草', '兔子', '树木', '老鹰'), '["草", "树木"]', '草和树木能进行光合作用，是生产者', 3);

-- ==================== 示例视图 ====================

-- 创建学生成绩视图
CREATE OR REPLACE VIEW student_scores AS
SELECT 
  u.id as student_id,
  u.username,
  a.title as assignment_title,
  a.subject,
  sp.correct_rate,
  sp.completed_at
FROM users u
INNER JOIN student_progress sp ON u.id = sp.student_id
INNER JOIN assignments a ON sp.assignment_id = a.id
WHERE u.role = 'student';

-- 创建班级作业统计视图
CREATE OR REPLACE VIEW class_assignment_stats AS
SELECT 
  c.id as class_id,
  c.name as class_name,
  a.id as assignment_id,
  a.title,
  a.subject,
  COUNT(DISTINCT sp.student_id) as submitted_count,
  AVG(sp.correct_rate) as avg_correct_rate
FROM classes c
INNER JOIN assignments a ON c.id = a.class_id
LEFT JOIN student_progress sp ON a.id = sp.assignment_id
GROUP BY c.id, a.id;

-- ==================== 完成提示 ====================
SELECT '✅ 数据库初始化完成！' as status;
