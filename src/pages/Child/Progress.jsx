import { Card, Progress, Statistic } from 'antd';
import { ArrowUpOutlined, CheckCircleOutlined, ClockCircleOutlined, StarOutlined } from '@ant-design/icons';
import useStore from '../../store/appStore';

const ProgressPage = () => {
  const { user, stats } = useStore();

  const chartData = [
    { day: '周一', points: 45 },
    { day: '周二', points: 60 },
    { day: '周三', points: 35 },
    { day: '周四', points: 80 },
    { day: '周五', points: 55 },
    { day: '周六', points: 90 },
    { day: '周日', points: 70 },
  ];

  const maxPoints = Math.max(...chartData.map(d => d.points));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <header className="bg-white shadow-sm p-4 rounded-xl mb-4">
        <h1 className="text-xl font-bold text-gray-800">📈 我的学习进度</h1>
        <p className="text-gray-500 text-sm">继续加油，{user?.childName || user?.name}！</p>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card className="rounded-xl">
          <Statistic
            title="本周积分"
            value={stats.weeklyPoints || 435}
            prefix={<ArrowUpOutlined className="text-green-500" />}
            suffix="分"
          />
        </Card>
        <Card className="rounded-xl">
          <Statistic
            title="完成任务"
            value={stats.completedTasks || 23}
            prefix={<CheckCircleOutlined className="text-blue-500" />}
            suffix="个"
          />
        </Card>
        <Card className="rounded-xl">
          <Statistic
            title="学习天数"
            value={stats.studyDays || 15}
            prefix={<ClockCircleOutlined className="text-orange-500" />}
            suffix="天"
          />
        </Card>
        <Card className="rounded-xl">
          <Statistic
            title="正确率"
            value={stats.accuracy || 85}
            prefix={<StarOutlined className="text-purple-500" />}
            suffix="%"
          />
        </Card>
      </div>

      <Card className="rounded-xl mb-4">
        <h2 className="text-lg font-semibold mb-4">📊 每日积分趋势</h2>
        <div className="flex items-end justify-between h-40 gap-2">
          {chartData.map((item) => (
            <div key={item.day} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-lg transition-all hover:from-blue-500 hover:to-blue-700"
                style={{ height: `${(item.points / maxPoints) * 100}%`, minHeight: '10px' }}>
              </div>
              <span className="text-xs text-gray-500 mt-2">{item.day}</span>
              <span className="text-xs font-semibold text-gray-700">{item.points}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="rounded-xl mb-4">
        <h2 className="text-lg font-semibold mb-4">🎯 积分目标进度</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">月度目标</span>
              <span className="font-semibold">1200 / 1500 分</span>
            </div>
            <Progress percent={80} strokeColor="#6366f1" showInfo={false} />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">本周目标</span>
              <span className="font-semibold">435 / 500 分</span>
            </div>
            <Progress percent={87} strokeColor="#10b981" showInfo={false} />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">连续打卡</span>
              <span className="font-semibold">7 天</span>
            </div>
            <Progress percent={100} strokeColor="#f59e0b" showInfo={false} />
          </div>
        </div>
      </Card>

      <Card className="rounded-xl">
        <h2 className="text-lg font-semibold mb-4">🏅 成就徽章</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-1">🌟</div>
            <span className="text-xs text-gray-600">初出茅庐</span>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">🔥</div>
            <span className="text-xs text-gray-600">连续7天</span>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">💯</div>
            <span className="text-xs text-gray-600">满分达人</span>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1 opacity-30">🎯</div>
            <span className="text-xs text-gray-400">再接再厉</span>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">📚</div>
            <span className="text-xs text-gray-600">阅读小能手</span>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1 opacity-30">⭐</div>
            <span className="text-xs text-gray-400">数学之星</span>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1 opacity-30">🎨</div>
            <span className="text-xs text-gray-400">创意天才</span>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1 opacity-30">🏆</div>
            <span className="text-xs text-gray-400">学习冠军</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProgressPage;
