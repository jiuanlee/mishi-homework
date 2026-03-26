import {create} from 'zustand';

interface Homework {
  id: string;
  title: string;
  subject: string;
  grade: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  mode: 'ai' | 'traditional';
  dueDate: string;
  completed: boolean;
  score?: number;
}

interface HomeworkState {
  homeworks: Homework[];
  getHomeworkById: (id: string) => Homework | undefined;
  addHomework: (homework: Homework) => void;
  submitHomework: (id: string, score: number) => void;
}

const mockHomeworks: Homework[] = [
  {
    id: '1',
    title: '分数运算练习',
    subject: '数学',
    grade: '三年级',
    questionCount: 10,
    difficulty: 'medium',
    mode: 'ai',
    dueDate: '2024-01-20',
    completed: false,
  },
  {
    id: '2',
    title: '古诗词背诵',
    subject: '语文',
    grade: '三年级',
    questionCount: 5,
    difficulty: 'easy',
    mode: 'traditional',
    dueDate: '2024-01-18',
    completed: true,
    score: 95,
  },
  {
    id: '3',
    title: '英语单词测试',
    subject: '英语',
    grade: '三年级',
    questionCount: 20,
    difficulty: 'hard',
    mode: 'ai',
    dueDate: '2024-01-22',
    completed: false,
  },
  {
    id: '4',
    title: '应用题专项',
    subject: '数学',
    grade: '三年级',
    questionCount: 8,
    difficulty: 'hard',
    mode: 'traditional',
    dueDate: '2024-01-15',
    completed: true,
    score: 88,
  },
];

export const useHomeworkStore = create<HomeworkState>((set, get) => ({
  homeworks: mockHomeworks,

  getHomeworkById: (id: string) => {
    return get().homeworks.find((hw) => hw.id === id);
  },

  addHomework: (homework: Homework) => {
    set((state) => ({
      homeworks: [...state.homeworks, homework],
    }));
  },

  submitHomework: (id: string, score: number) => {
    set((state) => ({
      homeworks: state.homeworks.map((hw) =>
        hw.id === id ? {...hw, completed: true, score} : hw
      ),
    }));
  },
}));
