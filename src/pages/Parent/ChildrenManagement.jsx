import { useState } from 'react';
import { Card, Button, Table, Tag, Modal, Form, Input, Select, message, Popconfirm, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import useStore from '../../store/appStore';

const ChildrenManagement = () => {
  const { children, setChildren } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [form] = Form.useForm();

  const mockChildrenData = [
    { id: 'child001', name: '小明', age: 8, grade: '二年级', gender: 'male', hobby: '画画,阅读', status: 'active' },
    { id: 'child002', name: '小红', age: 6, grade: '一年级', gender: 'female', hobby: '跳舞,唱歌', status: 'active' },
  ];

  const displayChildren = children.length > 0 ? children : mockChildrenData;

  const handleAdd = () => {
    setEditingChild(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingChild(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const updated = children.filter(c => c.id !== id);
    setChildren(updated);
    message.success('删除成功');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingChild) {
        const updated = children.map(c => 
          c.id === editingChild.id ? { ...c, ...values } : c
        );
        setChildren(updated);
        message.success('修改成功');
      } else {
        const newChild = {
          id: `child${Date.now()}`,
          ...values,
          status: 'active'
        };
        setChildren([...children, newChild]);
        message.success('添加成功');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('验证失败:', error);
    }
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar 
            icon={<UserOutlined />} 
            style={{ backgroundColor: record.gender === 'female' ? '#ff6b9d' : '#1890ff' }}
          />
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-gray-400 text-xs">{record.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => (
        <Tag color={gender === 'male' ? 'blue' : 'pink'}>
          {gender === 'male' ? <><ManOutlined /> 男</> : <><WomanOutlined /> 女</>}
        </Tag>
      ),
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'grade',
    },
    {
      title: '爱好',
      dataIndex: 'hobby',
      key: 'hobby',
      render: (hobby) => hobby || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除此儿童账号？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">👶 儿童账号管理</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加儿童
          </Button>
        </div>

        <Table 
          dataSource={displayChildren} 
          columns={columns} 
          rowKey="id"
          pagination={false}
        />

        <div className="mt-4 text-gray-500 text-sm">
          <p>说明：在这里您可以添加、编辑和删除儿童账号。绑定儿童账号后，可以在任务管理和打卡审核中切换查看不同儿童的学习情况。</p>
        </div>
      </Card>

      <Modal
        title={editingChild ? '编辑儿童信息' : '添加儿童'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入儿童姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="性别"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select placeholder="请选择性别">
              <Select.Option value="male">男</Select.Option>
              <Select.Option value="female">女</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="age"
            label="年龄"
            rules={[{ required: true, message: '请输入年龄' }]}
          >
            <Input type="number" placeholder="请输入年龄" min={3} max={18} />
          </Form.Item>

          <Form.Item
            name="grade"
            label="年级"
            rules={[{ required: true, message: '请输入年级' }]}
          >
            <Input placeholder="如：一年级、二年级" />
          </Form.Item>

          <Form.Item
            name="hobby"
            label="爱好"
          >
            <Input placeholder="多个爱好用逗号分隔，如：画画,阅读,跳舞" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChildrenManagement;
