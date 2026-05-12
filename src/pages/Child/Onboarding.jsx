import { useState } from 'react';
import { Button, Input, Select, Card, message, Progress } from 'antd';
import { UserOutlined, CalendarOutlined, HeartOutlined, BookOutlined, ArrowRightOutlined } from '@ant-design/icons';
import useStore from '../../store/appStore';
import { useNavigate } from 'react-router-dom';

const hobbies = ['画画', '阅读', '唱歌', '跳舞', '编程', '运动', '手工', '音乐'];
const grades = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三'];

const questions = [
  { id: 'q1', question: '2 + 3 = ?', options: ['4', '5', '6'], answer: '5' },
  { id: 'q2', question: '太阳从哪边升起？', options: ['西边', '东边', '南边'], answer: '东边' },
  { id: 'q3', question: '以下哪个是动物？', options: ['桌子', '小猫', '书本'], answer: '小猫' },
  { id: 'q4', question: '一年有几个季节？', options: ['3', '4', '5'], answer: '4' },
];

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    hobbies: []
  });
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const { setUser } = useStore();
  const navigate = useNavigate();

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleHobbyChange = (values) => {
    setFormData(prev => ({ ...prev, hobbies: values }));
  };

  const handleAnswer = (qid, answer) => {
    setAnswers(prev => ({ ...prev, [qid]: answer }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.answer) correct++;
    });
    return correct;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.age || !formData.grade) {
        message.warning('请填写完整信息');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (Object.keys(answers).length < questions.length) {
        message.warning('请回答所有问题');
        return;
      }
      const s = calculateScore();
      setScore(s);
      setStep(3);
    } else if (step === 3) {
      const user = JSON.parse(localStorage.getItem('user'));
      user.name = formData.name;
      user.age = parseInt(formData.age);
      user.grade = formData.grade;
      user.hobby = formData.hobbies.join(',');
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem(`onboarded_${user.id}`, 'true');
      navigate('/child/home');
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">请告诉我关于你的信息</h2>
      
      <Input
        prefix={<UserOutlined />}
        placeholder="你的名字"
        value={formData.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        size="large"
      />
      
      <Input
        prefix={<CalendarOutlined />}
        placeholder="你的年龄"
        type="number"
        value={formData.age}
        onChange={(e) => handleInputChange('age', e.target.value)}
        size="large"
      />
      
      <Select
        prefix={<BookOutlined />}
        placeholder="你几年级了"
        value={formData.grade}
        onChange={(value) => handleInputChange('grade', value)}
        size="large"
        options={grades.map(g => ({ value: g, label: g }))}
      />
      
      <Select
        prefix={<HeartOutlined />}
        placeholder="你的爱好（可多选）"
        mode="multiple"
        value={formData.hobbies}
        onChange={handleHobbyChange}
        size="large"
        options={hobbies.map(h => ({ value: h, label: h }))}
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">来做个小测试吧！</h2>
      
      {questions.map((q, index) => (
        <Card key={q.id} className="bg-gray-50">
          <div className="font-medium text-gray-700 mb-3">{index + 1}. {q.question}</div>
          <div className="space-y-2">
            {q.options.map((opt) => (
              <Button
                key={opt}
                type={answers[q.id] === opt ? 'primary' : 'default'}
                block
                onClick={() => handleAnswer(q.id, opt)}
              >
                {opt}
              </Button>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center space-y-4">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-xl font-bold text-gray-800">太棒了！</h2>
      <p className="text-gray-500">你的测试得分：</p>
      <div className="text-5xl font-bold text-orange-500">{score}/{questions.length}</div>
      
      <Card className="mt-6">
        <h3 className="font-semibold text-gray-700 mb-3">📋 你的人物简报</h3>
        <div className="text-left space-y-2 text-gray-600">
          <p>👦 姓名：{formData.name}</p>
          <p>🎂 年龄：{formData.age}岁</p>
          <p>📚 年级：{formData.grade}</p>
          <p>❤️ 爱好：{formData.hobbies.join('、')}</p>
          <p>🏆 知识水平：{score === questions.length ? '优秀' : score >= questions.length * 0.7 ? '良好' : '继续加油'}</p>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-orange-50 to-yellow-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎠</div>
          <h1 className="text-xl font-bold text-gray-800">童趣积分乐园</h1>
        </div>

        <div className="mb-6">
          <Progress
            percent={(step / 3) * 100}
            showInfo={false}
            strokeColor="#FF6B6B"
          />
        </div>

        <Card className="rounded-2xl shadow-lg">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <div className="mt-6">
            <Button
              type="primary"
              size="large"
              block
              onClick={handleNext}
              icon={<ArrowRightOutlined />}
              className="h-12 font-semibold"
            >
              {step < 3 ? '下一步' : '开始探索'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;