import { useState } from 'react';
import { Card, Select, DatePicker } from 'antd';
import { BarChartOutlined, RiseOutlined, AimOutlined, ClockCircleOutlined } from '@ant-design/icons';

const LearningReports = () => {
  const [period, setPeriod] = useState('weekly');
  
  const weekData = [
    { day: '周一', hours: 2.5, tasks: 3, accuracy: 85 },
    { day: '周二', hours: 3.0, tasks: 4, accuracy: 90 },
    { day: '周三', hours: 2.0, tasks: 2, accuracy: 88 },
    { day: '周四', hours: 3.5, tasks: 5, accuracy: 92 },
    { day: '周五', hours: 2.5, tasks: 3, accuracy: 87 },
    { day: '周六', hours: 4.0, tasks: 6, accuracy: 95 },
    { day: '周日', hours: 3.0, tasks: 4, accuracy: 91 },
  ];

  const subjectData = [
    { name: '语文', accuracy: 92, completedTasks: 15, avgScore: 90 },
    { name: '数学', accuracy: 88, completedTasks: 18, avgScore: 85 },
    { name: '英语', accuracy: 95, completedTasks: 12, avgScore: 93 },
  ];

  const weeklyTotal = {
    hours: weekData.reduce((sum, d) => sum + d.hours, 0),
    tasks: weekData.reduce((sum, d) => sum + d.tasks, 0),
    avgAccuracy: Math.round(weekData.reduce((sum, d) => sum + d.accuracy, 0) / weekData.length),
  };

  const maxHours = Math.max(...weekData.map(d => d.hours));
  const maxTasks = Math.max(...weekData.map(d => d.tasks));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">📊 学习报告</h1>
        <div className="flex gap-4">
          <Select
            value={period}
            onChange={setPeriod}
            style={{ width: 120 }}
          >
            <Select.Option value="daily">今日</Select.Option>
            <Select.Option value="weekly">本周</Select.Option>
            <Select.Option value="monthly">本月</Select.Option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <ClockCircleOutlined className="text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">{weeklyTotal.hours}h</div>
              <div className="text-gray-500 text-sm">学习时长</div>
            </div>
          </div>
        </Card>
        
        <Card className="rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <BarChartOutlined className="text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">{weeklyTotal.tasks}</div>
              <div className="text-gray-500 text-sm">完成任务</div>
            </div>
          </div>
        </Card>
        
        <Card className="rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <AimOutlined className="text-yellow-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">{weeklyTotal.avgAccuracy}%</div>
              <div className="text-gray-500 text-sm">平均正确率</div>
            </div>
          </div>
        </Card>
        
        <Card className="rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <RiseOutlined className="text-purple-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-500">+12%</div>
              <div className="text-gray-500 text-sm">较上周</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-xl shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">📈 每日学习时长</h3>
          <div className="flex items-end justify-between h-48 gap-2">
            {weekData.map((data) => (
              <div key={data.day} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-blue-400 to-blue-200 rounded-t-lg transition-all hover:from-blue-500 hover:to-blue-300"
                  style={{ height: `${(data.hours / maxHours) * 100}%` }}
                />
                <div className="text-xs text-gray-500 mt-2">{data.day}</div>
                <div className="text-xs font-medium text-gray-700">{data.hours}h</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">📊 学科分析</h3>
          <div className="space-y-4">
            {subjectData.map((subject) => (
              <div key={subject.name}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-700">{subject.name}</span>
                  <span className="text-gray-500">{subject.accuracy}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      subject.accuracy >= 90 ? 'bg-green-400' :
                      subject.accuracy >= 80 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${subject.accuracy}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  完成任务: {subject.completedTasks} | 平均分: {subject.avgScore}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="rounded-xl shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">📋 任务完成详情</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-600">日期</th>
                  <th className="text-left p-3 font-medium text-gray-600">学习时长</th>
                  <th className="text-left p-3 font-medium text-gray-600">完成任务</th>
                  <th className="text-left p-3 font-medium text-gray-600">正确率</th>
                </tr>
              </thead>
              <tbody>
                {weekData.map((data) => (
                  <tr key={data.day} className="border-b hover:bg-gray-50">
                    <td className="p-3">{data.day}</td>
                    <td className="p-3">{data.hours}小时</td>
                    <td className="p-3">{data.tasks}个</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        data.accuracy >= 90 ? 'bg-green-100 text-green-600' :
                        data.accuracy >= 80 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {data.accuracy}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LearningReports;