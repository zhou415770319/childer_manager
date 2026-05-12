import { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge, Progress } from 'antd';
import { GiftOutlined, BarChartOutlined, UserOutlined, CheckCircleOutlined, ClockCircleOutlined, StarOutlined } from '@ant-design/icons';
import useStore from '../../store/appStore';
import { useNavigate } from 'react-router-dom';
import { getTaskTypeLabel, getDifficultyLabel } from '../../utils/helpers';

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
      active ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'
    }`}
  >
    <Icon className="text-xl mb-1" />
    <span className="text-xs">{label}</span>
  </button>
);

const TaskCard = ({ task }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/child/task/${task.id}`)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              task.type === 'daily' ? 'bg-blue-100 text-blue-600' :
              task.type === 'homework' ? 'bg-green-100 text-green-600' :
              'bg-purple-100 text-purple-600'
            }`}>
              {getTaskTypeLabel(task.type)}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              task.difficulty === 'easy' ? 'bg-green-100 text-green-600' :
              task.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              {getDifficultyLabel(task.difficulty)}
            </span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">{task.title}</h3>
          <p className="text-gray-500 text-sm line-clamp-2">{task.description}</p>
        </div>
        <div className="text-right ml-4">
          <div className="flex items-center gap-1 text-yellow-500 font-bold">
            <StarOutlined />
            <span>{task.basePoints}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
            <ClockCircleOutlined />
            <span>今日截止</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const ChildHome = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { user, todayTasks, stats, loadChildData } = useStore();
  const navigate = useNavigate();
  const completedCount = todayTasks.filter(t => t.status === 'completed').length;
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current && user?.childId) {
      loadChildData(user.childId);
      initializedRef.current = true;
    }
  }, [user?.childId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'mall') navigate('/child/mall');
    if (tab === 'progress') navigate('/child/progress');
    if (tab === 'profile') navigate('/child/profile');
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 pb-20">
      <header className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">🎠 童趣积分乐园</h1>
            <p className="text-gray-500 text-sm">嗨，{user.childName || user.name}！今天也要加油哦 💪</p>
          </div>
          <div className="bg-yellow-100 px-4 py-2 rounded-full">
            <div className="flex items-center gap-1">
              <StarOutlined className="text-yellow-500" />
              <span className="text-yellow-600 font-bold text-lg">{stats.totalPoints}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-4 mt-4">
        <Card className="rounded-2xl shadow-sm">
          <div className="flex justify-around text-center">
            <div>
              <div className="text-2xl font-bold text-blue-500">{todayTasks.length}</div>
              <div className="text-gray-500 text-sm">今日任务</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">{completedCount}</div>
              <div className="text-gray-500 text-sm">已完成</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500">{stats.accuracy}%</div>
              <div className="text-gray-500 text-sm">正确率</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>今日进度</span>
              <span>{completedCount}/{todayTasks.length}</span>
            </div>
            <Progress
              percent={todayTasks.length > 0 ? (completedCount / todayTasks.length) * 100 : 0}
              strokeColor="#FF6B6B"
              showInfo={false}
            />
          </div>
        </Card>
      </div>

      <div className="mx-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-700">📋 今日任务</h2>
          <Badge count={todayTasks.length - completedCount} className="bg-orange-500" />
        </div>

        <div className="space-y-3">
          {todayTasks.length > 0 ? (
            todayTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <Card className="text-center py-8">
              <CheckCircleOutlined className="text-green-500 text-4xl mb-2" />
              <p className="text-gray-500">今日任务已全部完成！</p>
            </Card>
          )}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <div className="flex justify-around py-2">
          <NavItem icon={CheckCircleOutlined} label="任务" active={activeTab === 'home'} onClick={() => handleTabChange('home')} />
          <NavItem icon={GiftOutlined} label="商城" active={activeTab === 'mall'} onClick={() => handleTabChange('mall')} />
          <NavItem icon={BarChartOutlined} label="进度" active={activeTab === 'progress'} onClick={() => handleTabChange('progress')} />
          <NavItem icon={UserOutlined} label="我的" active={activeTab === 'profile'} onClick={() => handleTabChange('profile')} />
        </div>
      </nav>
    </div>
  );
};

export default ChildHome;
