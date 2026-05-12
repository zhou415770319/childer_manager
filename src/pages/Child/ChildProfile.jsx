import { Card, Button, Divider, Tag } from 'antd';
import { ArrowLeftOutlined, StarOutlined, UserOutlined, CalendarOutlined, BookOutlined, HeartOutlined, SettingOutlined, LogoutOutlined, CheckCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/appStore';

const MenuItem = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-between w-full p-4 hover:bg-gray-50 rounded-xl transition-colors"
  >
    <div className="flex items-center gap-3">
      <Icon className="text-orange-500" />
      <span className="text-gray-700">{label}</span>
    </div>
    <ArrowLeftOutlined className="text-gray-400 rotate-180" />
  </button>
);

const ChildProfile = () => {
  const navigate = useNavigate();
  const { user, stats, logout } = useStore();

  const childId = user?.childId;
  const testHistory = JSON.parse(localStorage.getItem(`testHistory_${childId}`) || '[]');
  const lastTestScore = localStorage.getItem(`testScore_${childId}`);
  const getLevel = (score) => {
    if (score >= 90) return { name: '小学霸', color: 'gold', stars: 5 };
    if (score >= 75) return { name: '小学神', color: 'orange', stars: 4 };
    if (score >= 60) return { name: '小学员', color: 'blue', stars: 3 };
    if (score >= 40) return { name: '初学者', color: 'green', stars: 2 };
    return { name: '小白', color: 'gray', stars: 1 };
  };
  const level = lastTestScore ? getLevel(parseInt(lastTestScore)) : null;

  const handleRetest = () => {
    navigate('/child/test');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      <header className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/child/home')}
            className="flex items-center gap-2 text-gray-600"
          >
            <ArrowLeftOutlined />
            <span>返回</span>
          </button>
          <h1 className="text-xl font-bold text-gray-800">👤 我的</h1>
          <div className="w-12"></div>
        </div>
      </header>

      <div className="px-4 py-4">
        <Card className="rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <UserOutlined className="text-4xl" />
            </div>
            <h2 className="text-xl font-bold">{user.childName || user.name}</h2>
            <div className="flex items-center justify-center gap-1 mt-2">
              <StarOutlined />
              <span className="text-yellow-300 font-bold text-lg">{stats.totalPoints}</span>
              <span className="text-white/80 text-sm">积分</span>
            </div>
            {level && (
              <Tag color={level.color} className="mt-2 font-bold">
                🏅 {level.name}
              </Tag>
            )}
          </div>
          
          <div className="p-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-500">{stats.completionRate}%</div>
              <div className="text-gray-500 text-sm">完成率</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-500">{stats.learningHours}h</div>
              <div className="text-gray-500 text-sm">学习时长</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-500">{stats.accuracy}%</div>
              <div className="text-gray-500 text-sm">正确率</div>
            </div>
          </div>
        </Card>
      </div>

      {lastTestScore && (
        <div className="px-4">
          <Card className="rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircleOutlined className="text-green-500 text-xl" />
                <div>
                  <div className="font-semibold text-gray-800">知识测试</div>
                  <div className="text-gray-500 text-sm">最近得分：{lastTestScore}分</div>
                </div>
              </div>
              <Button 
                type="primary" 
                icon={<ThunderboltOutlined />}
                onClick={handleRetest}
                className="bg-orange-500"
              >
                重新测试
              </Button>
            </div>
            {testHistory.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="text-gray-500 text-sm mb-2">历史测试：</div>
                <div className="flex gap-2 flex-wrap">
                  {testHistory.slice(-5).map((score, index) => (
                    <Tag key={index} color={score >= 90 ? 'gold' : score >= 60 ? 'blue' : 'orange'}>
                      {score}分
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      <div className="px-4 mt-4">
        <Card className="rounded-2xl shadow-sm">
          <div className="p-2">
            <MenuItem icon={CalendarOutlined} label={`年龄：${user.childAge || 8}岁`} />
            <Divider className="my-1" />
            <MenuItem icon={BookOutlined} label={`年级：${user.childGrade || '二年级'}`} />
            <Divider className="my-1" />
            <MenuItem icon={HeartOutlined} label={`爱好：${user.childHobby || '阅读、运动'}`} />
          </div>
        </Card>
      </div>

      <div className="px-4 mt-4">
        <Card className="rounded-2xl shadow-sm">
          <div className="p-2">
            <MenuItem icon={StarOutlined} label="积分记录" />
            <Divider className="my-1" />
            <MenuItem icon={SettingOutlined} label="设置" />
            <Divider className="my-1" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-4 hover:bg-red-50 rounded-xl transition-colors text-red-500"
            >
              <LogoutOutlined />
              <span>退出登录</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChildProfile;
