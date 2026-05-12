import { useState, useEffect } from 'react';
import { Button, Card, Progress, Radio, message, Typography } from 'antd';
import { ArrowRightOutlined, StarOutlined, BookOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/appStore';

const { Title, Paragraph } = Typography;

const getDifficultyQuestions = (level) => {
  const easyQuestions = [
    { id: 1, question: '2 + 3 = ?', options: ['4', '5', '6', '7'], answer: 1 },
    { id: 2, question: '以下哪个是水果？', options: ['苹果', '白菜', '黄瓜', '西红柿'], answer: 0 },
    { id: 3, question: '一年有几个季节？', options: ['2个', '3个', '4个', '5个'], answer: 2 },
    { id: 4, question: '太阳从哪个方向升起？', options: ['西边', '东边', '南边', '北边'], answer: 1 },
    { id: 5, question: '5 - 2 = ?', options: ['2', '3', '4', '5'], answer: 1 },
    { id: 6, question: '以下哪个是动物？', options: ['书本', '铅笔', '小猫', '桌子'], answer: 2 },
    { id: 7, question: '一周有几天？', options: ['5天', '6天', '7天', '8天'], answer: 2 },
    { id: 8, question: '3 × 2 = ?', options: ['4', '5', '6', '7'], answer: 2 },
  ];

  const mediumQuestions = [
    { id: 1, question: '12 + 35 = ?', options: ['45', '46', '47', '48'], answer: 2 },
    { id: 2, question: '15 - 7 = ?', options: ['6', '7', '8', '9'], answer: 2 },
    { id: 3, question: '4 × 6 = ?', options: ['20', '22', '24', '26'], answer: 2 },
    { id: 4, question: '20 ÷ 4 = ?', options: ['4', '5', '6', '7'], answer: 1 },
    { id: 5, question: '一年有多少个月？', options: ['10个月', '11个月', '12个月', '13个月'], answer: 2 },
    { id: 6, question: '60分钟等于多少小时？', options: ['半小时', '1小时', '2小时', '3小时'], answer: 1 },
    { id: 7, question: '下列哪个是哺乳动物？', options: ['鲨鱼', '鸽子', '蝙蝠', '青蛙'], answer: 2 },
    { id: 8, question: '8 + 9 = ?', options: ['15', '16', '17', '18'], answer: 2 },
  ];

  const hardQuestions = [
    { id: 1, question: '125 + 376 = ?', options: ['491', '500', '501', '511'], answer: 2 },
    { id: 2, question: '1000 - 437 = ?', options: ['553', '563', '573', '583'], answer: 1 },
    { id: 3, question: '24 × 15 = ?', options: ['320', '340', '360', '380'], answer: 2 },
    { id: 4, question: '144 ÷ 12 = ?', options: ['10', '11', '12', '13'], answer: 2 },
    { id: 5, question: '地球到太阳的平均距离约是多少公里？', options: ['1亿', '1.5亿', '2亿', '2.5亿'], answer: 1 },
    { id: 6, question: '水的化学式是什么？', options: ['CO2', 'H2O', 'O2', 'NaCl'], answer: 1 },
    { id: 7, question: '光每秒传播约多少公里？', options: ['3万', '30万', '300万', '3000万'], answer: 1 },
    { id: 8, question: '36 × 25 = ?', options: ['800', '850', '900', '950'], answer: 2 },
  ];

  if (level === 'hard') return hardQuestions;
  if (level === 'medium') return mediumQuestions;
  return easyQuestions;
};

const getDifficultyLevel = (childId) => {
  const history = JSON.parse(localStorage.getItem(`testHistory_${childId}`) || '[]');
  if (history.length === 0) {
    const lastScore = localStorage.getItem(`testScore_${childId}`);
    if (lastScore) return parseInt(lastScore) >= 80 ? 'medium' : 'easy';
    return 'easy';
  }

  const avgScore = history.reduce((a, b) => a + b, 0) / history.length;
  if (avgScore >= 85) return 'hard';
  if (avgScore >= 60) return 'medium';
  return 'easy';
};

const getDifficultyName = (level) => {
  if (level === 'hard') return '困难';
  if (level === 'medium') return '中等';
  return '简单';
};

const ChildTest = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const { user, setUser } = useStore();
  const navigate = useNavigate();

  const childId = user?.childId;
  const childName = user?.childName || '小朋友';
  const difficulty = getDifficultyLevel(childId);
  const questions = getDifficultyQuestions(difficulty);
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelect = (optionIndex) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionIndex });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.answer) {
        correct++;
      }
    });

    const score = Math.round((correct / questions.length) * 100);

    const historyKey = `testHistory_${childId}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    history.push(score);
    localStorage.setItem(historyKey, JSON.stringify(history));
    localStorage.setItem(`testScore_${childId}`, score.toString());

    const updatedUser = {
      ...user,
      testScore: score,
      testCompleted: true
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    setShowResult(true);
  };

  const handleComplete = () => {
    navigate('/child/home');
  };

  if (showResult) {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.answer) {
        correct++;
      }
    });
    const score = Math.round((correct / questions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <Card className="max-w-md mx-auto mt-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <Title level={2} className="mb-2">测试完成！{childName}</Title>
          <Paragraph className="text-gray-600 mb-4">
            本次测试难度：{getDifficultyName(difficulty)}
          </Paragraph>
          <Paragraph className="text-gray-600 mb-4">
            你答对了 {correct} 题，共 {questions.length} 题
          </Paragraph>

          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
            <div className="text-white text-center">
              <div className="text-4xl font-bold">{score}</div>
              <div className="text-sm">分</div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <StarOutlined
                key={i}
                className={`text-xl ${i < Math.ceil(score / 20) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>

          {score >= 85 && difficulty !== 'hard' && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
              🌟 太棒了！下次测试难度将提升！
            </div>
          )}
          {score < 50 && difficulty !== 'easy' && (
            <div className="bg-blue-100 text-blue-700 p-3 rounded-lg mb-4">
              📚 别灰心！下次测试难度会降低哦！
            </div>
          )}

          <Button
            type="primary"
            size="large"
            onClick={handleComplete}
            icon={<ArrowRightOutlined />}
            className="w-full"
          >
            进入乐园
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <Card className="max-w-md mx-auto mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOutlined className="text-blue-500" />
            <span className="text-gray-600">知识小测试 - {childName}</span>
          </div>
          <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-semibold">
            {getDifficultyName(difficulty)}
          </span>
        </div>

        <Progress
          percent={progress}
          strokeColor="#6366f1"
          showInfo={false}
          className="mb-6"
        />

        <div className="mb-6">
          <Title level={3} className="text-gray-800 mb-4">
            {currentQuestion.question}
          </Title>

          <Radio.Group
            value={answers[currentQuestion.id]}
            onChange={(e) => handleSelect(e.target.value)}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <Radio.Button
                key={index}
                value={index}
                className="w-full justify-start"
              >
                {option}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>

        <Button
          type="primary"
          size="large"
          block
          onClick={handleNext}
          icon={<ArrowRightOutlined />}
          disabled={answers[currentQuestion.id] === undefined}
        >
          {currentIndex < questions.length - 1 ? '下一题' : '查看结果'}
        </Button>
      </Card>
    </div>
  );
};

export default ChildTest;
