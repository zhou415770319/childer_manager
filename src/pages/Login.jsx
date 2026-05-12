import { useState } from 'react';
import { Button, Input, Card, message, Radio, Modal, Avatar } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, TeamOutlined, SmileOutlined } from '@ant-design/icons';
import useStore from '../store/appStore';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSecondPassword, setShowSecondPassword] = useState(false);
  const [secondPassword, setSecondPassword] = useState('');
  const [showChildSelect, setShowChildSelect] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loggedInChild, setLoggedInChild] = useState(null);
  const { setUser, setCurrentChild } = useStore();
  const navigate = useNavigate();

  const availableChildren = [
    { id: 'child001', name: '小明', age: 8, grade: '二年级', avatar: '👦' },
    { id: 'child002', name: '小红', age: 6, grade: '一年级', avatar: '👧' },
  ];

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'parent') {
      setShowSecondPassword(true);
    } else {
      setShowSecondPassword(false);
      setSecondPassword('');
    }
  };

  const handleLogin = async () => {
    if (!phone || !password) {
      message.warning('请输入手机号和密码');
      return;
    }

    if (!role) {
      message.warning('请选择登录角色');
      return;
    }

    if (role === 'parent' && !secondPassword) {
      message.warning('请输入家长二级密码');
      return;
    }

    setLoading(true);
    try {
      const result = await authAPI.login(phone, password, role, secondPassword);
      
      if (result.success) {
        if (result.data.role === 'child') {
          setLoggedInChild(result.data);
          setShowChildSelect(true);
          setLoading(false);
        } else {
          setUser(result.data);
          localStorage.setItem('user', JSON.stringify(result.data));
          navigate('/parent/dashboard');
        }
      } else {
        message.error(result.message);
        setLoading(false);
      }
    } catch (error) {
      message.error('登录失败，请重试');
      setLoading(false);
    }
  };

  const handleChildSelect = (child) => {
    setSelectedChild(child);
  };

  const confirmChildSelect = () => {
    if (!selectedChild) {
      message.warning('请选择一个儿童');
      return;
    }
    
    const updatedUser = {
      ...loggedInChild,
      childId: selectedChild.id,
      childName: selectedChild.name,
      childAge: selectedChild.age,
      childGrade: selectedChild.grade,
    };
    
    setUser(updatedUser);
    setCurrentChild(selectedChild);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    const hasTested = localStorage.getItem(`tested_${selectedChild.id}`);
    localStorage.setItem(`tested_${loggedInChild.id}_linked`, selectedChild.id);
    
    setShowChildSelect(false);
    
    if (hasTested) {
      navigate('/child/home');
    } else {
      navigate('/child/test');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-orange-50 to-yellow-100 flex items-center justify-center p-4">
      <Card 
        className="w-full max-w-md shadow-xl rounded-2xl"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🎠</div>
          <h1 className="text-2xl font-bold text-gray-800">童趣积分乐园</h1>
          <p className="text-gray-500 mt-2">让学习更有趣</p>
        </div>

        <div className="space-y-4">
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="请输入手机号"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            size="large"
          />
          
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="large"
          />

          <div className="border rounded-lg p-4">
            <p className="text-gray-600 mb-3">选择登录角色</p>
            <Radio.Group 
              value={role} 
              onChange={(e) => handleRoleSelect(e.target.value)}
              className="flex justify-around"
            >
              <Radio.Button value="parent">
                <TeamOutlined className="mr-2" />家长
              </Radio.Button>
              <Radio.Button value="child">
                <SmileOutlined className="mr-2" />儿童
              </Radio.Button>
            </Radio.Group>
          </div>

          {showSecondPassword && (
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="请输入家长二级密码"
              value={secondPassword}
              onChange={(e) => setSecondPassword(e.target.value)}
              size="large"
            />
          )}

          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={handleLogin}
            icon={<LoginOutlined />}
            className="h-12 text-base font-semibold"
          >
            登录
          </Button>
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>测试账号：</p>
          <p className="mt-1">手机号：13800138000 / 密码：123456</p>
          <p className="mt-1">家长二级密码：654321</p>
        </div>
      </Card>

      <Modal
        title="请选择你的账号"
        open={showChildSelect}
        closable={false}
        footer={[
          <Button key="cancel" onClick={() => {
            setShowChildSelect(false);
            setSelectedChild(null);
          }}>
            取消
          </Button>,
          <Button key="confirm" type="primary" onClick={confirmChildSelect} disabled={!selectedChild}>
            确认
          </Button>
        ]}
      >
        <div className="py-4">
          <p className="text-gray-600 mb-4">请选择你是哪一个小朋友：</p>
          <div className="space-y-3">
            {availableChildren.map((child) => (
              <div
                key={child.id}
                onClick={() => handleChildSelect(child)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedChild?.id === child.id 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="text-4xl">{child.avatar}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{child.name}</div>
                  <div className="text-gray-500 text-sm">
                    {child.grade} · {child.age}岁
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedChild?.id === child.id ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                }`}>
                  {selectedChild?.id === child.id && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
