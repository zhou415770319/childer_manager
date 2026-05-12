import { useState } from 'react';
import { Card, Button, Input, Select, Modal, Form, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, OpenAIOutlined, ReloadOutlined } from '@ant-design/icons';
import useStore from '../../store/appStore';
import { getTaskTypeLabel, getDifficultyLabel, getStatusLabel } from '../../utils/helpers';

const TaskManagement = () => {
  const { todayTasks, setTodayTasks } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form] = Form.useForm();

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      form.setFieldsValue(task);
    } else {
      setEditingTask(null);
      form.resetFields();
    }
    setShowModal(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingTask) {
        setTodayTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...values } : t));
        message.success('任务更新成功');
      } else {
        const newTask = {
          id: Date.now().toString(),
          ...values,
          status: 'active',
          deadline: new Date().toISOString()
        };
        setTodayTasks(prev => [...prev, newTask]);
        message.success('任务创建成功');
      }
      setShowModal(false);
      form.resetFields();
    });
  };

  const handleDelete = (taskId) => {
    setTodayTasks(prev => prev.filter(t => t.id !== taskId));
    message.success('任务删除成功');
  };

  const handleGenerateAI = () => {
    message.info('AI正在生成任务，请稍候...');
    setTimeout(() => {
      const aiTask = {
        id: Date.now().toString(),
        title: 'AI推荐任务 - 数学应用题练习',
        description: '完成10道数学应用题，巩固所学知识',
        type: 'homework',
        difficulty: 'medium',
        basePoints: 35,
        deadline: new Date().toISOString(),
        status: 'active'
      };
      setTodayTasks(prev => [...prev, aiTask]);
      message.success('AI任务生成成功');
    }, 1000);
  };

  const columns = [
    { title: '任务名称', dataIndex: 'title', key: 'title' },
    { title: '类型', dataIndex: 'type', key: 'type', render: (text) => getTaskTypeLabel(text) },
    { title: '难度', dataIndex: 'difficulty', key: 'difficulty', render: (text) => getDifficultyLabel(text) },
    { title: '积分', dataIndex: 'basePoints', key: 'basePoints', render: (text) => `${text} 分` },
    { title: '状态', dataIndex: 'status', key: 'status', render: (text) => getStatusLabel(text) },
    { 
      title: '操作', 
      key: 'action', 
      render: (_, record) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => handleOpenModal(record)}><EditOutlined /></Button>
          <Button size="small" danger onClick={() => handleDelete(record.id)}><DeleteOutlined /></Button>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">📋 任务管理</h1>
        <div className="flex gap-2">
          <Button onClick={handleGenerateAI} icon={<OpenAIOutlined />}>AI生成任务</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>新建任务</Button>
        </div>
      </div>

      <Card className="rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-gray-600">任务名称</th>
                <th className="text-left p-3 font-medium text-gray-600">类型</th>
                <th className="text-left p-3 font-medium text-gray-600">难度</th>
                <th className="text-left p-3 font-medium text-gray-600">积分</th>
                <th className="text-left p-3 font-medium text-gray-600">状态</th>
                <th className="text-left p-3 font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {todayTasks.map((task) => (
                <tr key={task.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{task.title}</td>
                  <td className="p-3">{getTaskTypeLabel(task.type)}</td>
                  <td className="p-3">{getDifficultyLabel(task.difficulty)}</td>
                  <td className="p-3">{task.basePoints} 分</td>
                  <td className="p-3">{getStatusLabel(task.status)}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button size="small" onClick={() => handleOpenModal(task)}><EditOutlined /></Button>
                      <Button size="small" danger onClick={() => handleDelete(task.id)}><DeleteOutlined /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        title={editingTask ? '编辑任务' : '新建任务'}
        visible={showModal}
        footer={null}
        onCancel={() => {
          setShowModal(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="任务名称"
            rules={[{ required: true, message: '请输入任务名称' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="任务描述"
            rules={[{ required: true, message: '请输入任务描述' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="任务类型"
            rules={[{ required: true, message: '请选择任务类型' }]}
          >
            <Select>
              <Select.Option value="daily">日常任务</Select.Option>
              <Select.Option value="homework">作业任务</Select.Option>
              <Select.Option value="extra">额外任务</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="difficulty"
            label="难度"
            rules={[{ required: true, message: '请选择难度' }]}
          >
            <Select>
              <Select.Option value="easy">简单</Select.Option>
              <Select.Option value="medium">中等</Select.Option>
              <Select.Option value="hard">困难</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="basePoints"
            label="基础积分"
            rules={[{ required: true, message: '请输入基础积分' }]}
          >
            <Input type="number" />
          </Form.Item>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setShowModal(false)}>取消</Button>
            <Button type="primary" onClick={handleSave}>保存</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskManagement;