import {create} from 'zustand';

interface Class {
  id: string;
  name: string;
  code: string;
  studentCount: number;
  completionRate: number;
  accuracyRate: number;
  students: Student[];
}

interface Student {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

interface ClassState {
  classes: Class[];
  addClass: (name: string) => void;
  removeClass: (id: string) => void;
  addStudent: (classId: string, studentName: string) => void;
  removeStudent: (classId: string, studentId: string) => void;
}

const mockClasses: Class[] = [
  {
    id: '1',
    name: '三年级一班',
    code: 'ABC123',
    studentCount: 45,
    completionRate: 87,
    accuracyRate: 92,
    students: [
      {id: 's1', name: '张小明', status: 'active'},
      {id: 's2', name: '李小红', status: 'active'},
      {id: 's3', name: '王小刚', status: 'active'},
    ],
  },
  {
    id: '2',
    name: '三年级二班',
    code: 'DEF456',
    studentCount: 42,
    completionRate: 85,
    accuracyRate: 89,
    students: [
      {id: 's4', name: '刘小丽', status: 'active'},
      {id: 's5', name: '陈小强', status: 'active'},
    ],
  },
];

export const useClassStore = create<ClassState>((set) => ({
  classes: mockClasses,

  addClass: (name: string) => {
    set((state) => ({
      classes: [
        ...state.classes,
        {
          id: Date.now().toString(),
          name,
          code: Math.random().toString(36).substring(2, 8).toUpperCase(),
          studentCount: 0,
          completionRate: 0,
          accuracyRate: 0,
          students: [],
        },
      ],
    }));
  },

  removeClass: (id: string) => {
    set((state) => ({
      classes: state.classes.filter((c) => c.id !== id),
    }));
  },

  addStudent: (classId: string, studentName: string) => {
    set((state) => ({
      classes: state.classes.map((c) =>
        c.id === classId
          ? {
              ...c,
              studentCount: c.studentCount + 1,
              students: [
                ...c.students,
                {id: Date.now().toString(), name: studentName, status: 'active'},
              ],
            }
          : c
      ),
    }));
  },

  removeStudent: (classId: string, studentId: string) => {
    set((state) => ({
      classes: state.classes.map((c) =>
        c.id === classId
          ? {
              ...c,
              studentCount: c.studentCount - 1,
              students: c.students.filter((s) => s.id !== studentId),
            }
          : c
      ),
    }));
  },
}));
