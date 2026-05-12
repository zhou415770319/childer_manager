import { create } from 'zustand';

const useStore = create((set, get) => ({
  user: undefined,
  children: [],
  currentChild: null,
  
  stats: {
    totalPoints: 0,
    completionRate: 0,
    learningHours: 0,
    accuracy: 0
  },
  
  tasks: [],
  todayTasks: [],
  
  checkins: [],
  pendingCheckins: [],
  
  gifts: [],
  
  textbooks: [],
  
  setUser: (user) => set({ user }),
  setChildren: (children) => set({ children }),
  setCurrentChild: (child) => set({ currentChild: child }),
  setStats: (stats) => set({ stats }),
  setTasks: (tasks) => set({ tasks }),
  setTodayTasks: (tasks) => set({ todayTasks }),
  setCheckins: (checkins) => set({ checkins }),
  setPendingCheckins: (checkins) => set({ pendingCheckins }),
  setGifts: (gifts) => set({ gifts }),
  setTextbooks: (textbooks) => set({ textbooks }),
  
  logout: () => {
    set({ 
      user: null, 
      children: [], 
      currentChild: null,
      stats: { totalPoints: 0, completionRate: 0, learningHours: 0, accuracy: 0 },
      tasks: [],
      todayTasks: [],
      checkins: [],
      pendingCheckins: [],
      gifts: [],
      textbooks: []
    });
    localStorage.removeItem('user');
  },
  
  loadChildData: async (childId) => {
    const mockTasks = [
      { id: '1', title: '语文作业 - 第5课练习', description: '完成语文课本第5课的练习题', type: 'homework', difficulty: 'medium', basePoints: 20, deadline: new Date().toISOString(), status: 'active' },
      { id: '2', title: '数学计算题 - 20道', description: '完成20道数学计算题', type: 'daily', difficulty: 'easy', basePoints: 30, deadline: new Date().toISOString(), status: 'active' },
      { id: '3', title: '背诵古诗', description: '背诵《静夜思》《春晓》《登鹳雀楼》', type: 'daily', difficulty: 'easy', basePoints: 15, deadline: new Date().toISOString(), status: 'active' },
    ];
    
    const mockCheckins = [
      { id: '1', taskId: '1', childId: childId, content: '已完成作业', aiScore: 95, aiComment: '作业完成优秀！', reviewStatus: 'pending', checkinTime: new Date().toISOString() },
    ];
    
    const mockGifts = [
      { id: '1', name: '彩色铅笔套装', description: '12色彩色铅笔', imageUrl: 'https://via.placeholder.com/100', price: 500, stock: 10, category: '文具' },
      { id: '2', name: '可爱玩偶', description: '毛绒玩具小熊', imageUrl: 'https://via.placeholder.com/100', price: 800, stock: 5, category: '玩具' },
      { id: '3', name: '儿童绘本', description: '精选绘本故事书', imageUrl: 'https://via.placeholder.com/100', price: 300, stock: 20, category: '图书' },
    ];
    
    set({
      todayTasks: mockTasks,
      checkins: mockCheckins,
      pendingCheckins: mockCheckins.filter(c => c.reviewStatus === 'pending'),
      gifts: mockGifts,
      stats: { totalPoints: 1280, completionRate: 85, learningHours: 2.5, accuracy: 92 }
    });
  }
}));

export default useStore;