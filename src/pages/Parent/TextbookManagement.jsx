import { useState } from 'react';
import { Card, Button, Input, Select, Modal, Form, message, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';

const TextbookManagement = () => {
  const [textbooks, setTextbooks] = useState([
    { id: '1', name: '一年级下册语文', type: 'textbook', totalPages: 120, currentPage: 45, pagesPerTask: 1, status: 'active', subject: '语文' },
    { id: '2', name: '二年级数学练习册', type: 'workbook', totalPages: 80, currentPage: 20, pagesPerTask: 2, status: 'active', subject: '数学' },
    { id: '3', name: '英语阅读理解', type: 'exercise', totalPages: 60, currentPage: 10, pagesPerTask: 3, status: 'paused', subject: '英语' },
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [form] = Form.useForm();

  const handleOpenModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      form.setFieldsValue(book);
    } else {
      setEditingBook(null);
      form.resetFields();
    }
    setShowModal(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingBook) {
        setTextbooks(prev => prev.map(b => b.id === editingBook.id ? { ...b, ...values } : b));
        message.success('教材更新成功');
      } else {
        const newBook = {
          id: Date.now().toString(),
          ...values,
          currentPage: 0,
          status: 'active'
        };
        setTextbooks(prev => [...prev, newBook]);
        message.success('教材添加成功');
      }
      setShowModal(false);
      form.resetFields();
    });
  };

  const handleDelete = (bookId) => {
    setTextbooks(prev => prev.filter(b => b.id !== bookId));
    message.success('教材删除成功');
  };

  const handleToggleStatus = (bookId) => {
    setTextbooks(prev => prev.map(b => 
      b.id === bookId 
        ? { ...b, status: b.status === 'active' ? 'paused' : 'active' }
        : b
    ));
  };

  const getProgress = (book) => {
    return Math.round((book.currentPage / book.totalPages) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">📚 教材管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>添加教材</Button>
      </div>

      <div className="space-y-4">
        {textbooks.map((book) => (
          <Card key={book.id} className="rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-800">{book.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    book.type === 'textbook' ? 'bg-blue-100 text-blue-600' :
                    book.type === 'workbook' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {book.type === 'textbook' ? '课本' : book.type === 'workbook' ? '习题册' : '练习卷'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    {book.subject}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>总页数: {book.totalPages}</span>
                  <span>已完成: {book.currentPage}</span>
                  <span>每次: {book.pagesPerTask}页</span>
                </div>
                
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>学习进度</span>
                    <span>{getProgress(book)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-400 to-red-400 transition-all"
                      style={{ width: `${getProgress(book)}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 ml-6">
                <Switch 
                  checked={book.status === 'active'}
                  onChange={() => handleToggleStatus(book.id)}
                  checkedChildren={<PlayCircleOutlined />}
                  unCheckedChildren={<PauseCircleOutlined />}
                />
                
                <Button size="small" onClick={() => handleOpenModal(book)}><EditOutlined /></Button>
                <Button size="small" danger onClick={() => handleDelete(book.id)}><DeleteOutlined /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {textbooks.length === 0 && (
        <Card className="text-center py-12">
          <PlusOutlined className="text-gray-300 text-4xl mb-2" />
          <p className="text-gray-500">暂无教材，请添加</p>
        </Card>
      )}

      <Modal
        title={editingBook ? '编辑教材' : '添加教材'}
        visible={showModal}
        footer={null}
        onCancel={() => {
          setShowModal(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="教材名称"
            rules={[{ required: true, message: '请输入教材名称' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="教材类型"
            rules={[{ required: true, message: '请选择教材类型' }]}
          >
            <Select>
              <Select.Option value="textbook">课本</Select.Option>
              <Select.Option value="workbook">习题册</Select.Option>
              <Select.Option value="exercise">练习卷</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="subject"
            label="学科"
            rules={[{ required: true, message: '请选择学科' }]}
          >
            <Select>
              <Select.Option value="语文">语文</Select.Option>
              <Select.Option value="数学">数学</Select.Option>
              <Select.Option value="英语">英语</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="totalPages"
            label="总页数"
            rules={[{ required: true, message: '请输入总页数' }]}
          >
            <Input type="number" />
          </Form.Item>
          
          <Form.Item
            name="pagesPerTask"
            label="每次任务页数"
            rules={[{ required: true, message: '请输入每次任务页数' }]}
          >
            <Input type="number" placeholder="支持小数如 0.33 表示1/3页" />
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

export default TextbookManagement;