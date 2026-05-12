import { useState, useEffect, useRef } from 'react';
import { Card, Button, Avatar, Badge } from 'antd';
import { BarChartOutlined, CheckCircleOutlined, ClockCircleOutlined, RiseOutlined, ArrowRightOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import useStore from '../../store/appStore';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, suffix, color }) => (
  <Card className="rounded-xl shadow-sm">
    <div className="text-gray-500 text-sm mb-1">{title}</div>
    <div className={`text-2xl font-bold ${color}`}>
      {value}
      {suffix && <span className="text-base font-normal text-gray-400 ml-1">{suffix}</span>}
    </div>
  </Card>
);

const CheckinItem = ({ checkin }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div>
        <div className="font-medium text-gray-800">{checkin.childName || '小明'} - {checkin.taskName || '语文作业'}</div>
        <div className="text-gray-500 text-sm">{new Date(checkin.checkinTime).toLocaleString()}</div>
      </div>
      <div className="flex gap-2">
        <Button size="small" onClick={() => navigate('/parent/checkins')}>查看详情</Button>
        <Button type="primary" size="small">审核</Button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, stats, pendingCheckins, children, setChildren, setCurrentChild, loadChildData, logout } = useStore();
  const navigate = useNavigate();
  const [activeChild, setActiveChild] = useState(null);
  const initializedRef = useRef(false);
  const dataLoadedRef = useRef(false);

  // 初始化：设置儿童数据
  useEffect(() => {
    if (!initializedRef.current && user?.children && user.children.length > 0 && children.length === 0) {
      const mockChildrenData = user.children.map((childId, index) => {
        if (childId === 'child001') {
          return { id: 'child001', name: '小明', age: 8, grade: '二年级' };
        } else if (childId === 'child002') {
          return { id: 'child002', name: '小红', age: 6, grade: '一年级' };
        }
        return { id: childId, name: `儿童${index + 1}`, age: 7, grade: '一年级' };
      });
      setChildren(mockChildrenData);
      initializedRef.current = true;
    }
  }, [user?.children, children.length, setChildren]);

  // 选中第一个儿童并加载数据
  useEffect(() => {
    if (initializedRef.current && children.length > 0 && !activeChild && !dataLoadedRef.current) {
      const child = children[0];
      setActiveChild(child);
      setCurrentChild(child);
      loadChildData(child.id);
      dataLoadedRef.current = true;
    }
  }, [children.length, children]);

  const handleChildSelect = (child) => {
    if (activeChild?.id !== child.id) {
      setActiveChild(child);
      setCurrentChild(child);
      loadChildData(child.id);
    }
  };

  const weekData = [
    { day: '周一', hours: 2.5 },
    { day: '周二', hours: 3.0 },
    { day: '周三', hours: 2.0 },
    { day: '周四', hours: 3.5 },
    { day: '周五', hours: 2.5 },
    { day: '周六', hours: 4.0 },
    { day: '周日', hours: 3.0 },
  ];

  const maxHours = Math.max(...weekData.map(d => d.hours));

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">家长管理后台</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">您好，{user.name}</span>
            <Button type="text" danger icon={<LogoutOutlined />} onClick={() => {
              logout();
              navigate('/login');
            }}>
              退出
            </Button>
            <Avatar size="small" icon={<UserOutlined />} />
          </div>
        </div>
      </header>

      <div className="px-6 py-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => handleChildSelect(child)}
              className={`flex-shrink-0 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow ${
                activeChild?.id === child.id ? 'ring-2 ring-orange-500' : ''
              }`}
            >
              <Avatar size="small" icon={<UserOutlined />} />
              <span>{child.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="总积分" value={stats.totalPoints} color="text-yellow-500" />
          <StatCard title="完成率" value={stats.completionRate} suffix="%" color="text-green-500" />
          <StatCard title="学习时长" value={stats.learningHours} suffix="小时" color="text-blue-500" />
          <StatCard title="正确率" value={stats.accuracy} suffix="%" color="text-purple-500" />
        </div>
      </div>

      <div className="px-6 mt-6">
        <Card className="rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">📈 本周学习趋势</h3>
            <Button size="small" onClick={() => navigate('/parent/reports')}>查看详情 <ArrowRightOutlined /></Button>
          </div>
          
          <div className="flex items-end justify-between h-40 gap-2">
            {weekData.map((data) => (
              <div key={data.day} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-orange-400 to-orange-200 rounded-t-lg transition-all hover:from-orange-500 hover:to-orange-300"
                  style={{ height: `${(data.hours / maxHours) * 100}%` }}
                />
                <div className="text-xs text-gray-500 mt-2">{data.day}</div>
                <div className="text-xs font-medium text-gray-700">{data.hours}h</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="px-6 mt-6">
        <Card className="rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">
              📋 待审核打卡 <Badge count={pendingCheckins.length} className="bg-orange-500" />
            </h3>
            <Button size="small" onClick={() => navigate('/parent/checkins')}>全部审核 <ArrowRightOutlined /></Button>
          </div>
          
          <div className="space-y-3">
            {pendingCheckins.length > 0 ? (
              pendingCheckins.map((checkin) => (
                <CheckinItem key={checkin.id} checkin={checkin} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <CheckCircleOutlined className="text-4xl mb-2" />
                <p>暂无待审核打卡</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="px-6 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/parent/children')}>
            <div className="text-center">
              <UserOutlined className="text-3xl text-blue-500 mb-2" />
              <div className="font-medium text-gray-700">儿童管理</div>
            </div>
          </Card>
          <Card className="rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/parent/tasks')}>
            <div className="text-center">
              <BarChartOutlined className="text-3xl text-blue-500 mb-2" />
              <div className="font-medium text-gray-700">任务管理</div>
            </div>
          </Card>
          <Card className="rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/parent/checkins')}>
            <div className="text-center">
              <CheckCircleOutlined className="text-3xl text-green-500 mb-2" />
              <div className="font-medium text-gray-700">打卡审核</div>
            </div>
          </Card>
          <Card className="rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/parent/textbooks')}>
            <div className="text-center">
              <ClockCircleOutlined className="text-3xl text-orange-500 mb-2" />
              <div className="font-medium text-gray-700">教材管理</div>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="px-6 mt-6 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/parent/reports')}>
            <div className="text-center">
              <RiseOutlined className="text-3xl text-purple-500 mb-2" />
              <div className="font-medium text-gray-700">学习报告</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
