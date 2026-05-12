import { useState } from 'react';
import { Card, Button, Input, message, Upload, Image } from 'antd';
import { ArrowLeftOutlined, CameraOutlined, PictureOutlined, VideoCameraOutlined, SendOutlined, StarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../../store/appStore';
import { getTaskTypeLabel, getDifficultyLabel } from '../../utils/helpers';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { todayTasks } = useStore();
  const [files, setFiles] = useState([]);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const task = todayTasks.find(t => t.id === id);

  const handleFileChange = ({ fileList }) => {
    setFiles(fileList);
  };

  const handleSubmit = () => {
    if (files.length === 0 && !note) {
      message.warning('请上传作业或填写备注');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      message.success('打卡成功！等待家长审核');
      setSubmitting(false);
      navigate('/child/home');
    }, 1000);
  };

  if (!task) {
    return <div className="min-h-screen flex items-center justify-center">任务不存在</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-6">
        <button 
          onClick={() => navigate('/child/home')}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
        >
          <ArrowLeftOutlined />
          <span>返回</span>
        </button>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
            {getTaskTypeLabel(task.type)}
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
            {getDifficultyLabel(task.difficulty)}
          </span>
        </div>
        
        <h1 className="text-xl font-bold">{task.title}</h1>
        <p className="text-white/80 mt-2">{task.description}</p>
        
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1">
            <ClockCircleOutlined />
            <span>今天 22:00 截止</span>
          </div>
          <div className="flex items-center gap-1 bg-yellow-400 text-gray-800 px-3 py-1 rounded-full">
            <StarOutlined />
            <span className="font-bold">{task.basePoints} 积分</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <Card className="rounded-2xl shadow-sm mb-4">
          <h2 className="font-semibold text-gray-700 mb-4">📤 上传作业</h2>
          
          <div className="flex gap-3 mb-4">
            <Button className="flex-1 bg-blue-100 text-blue-600 hover:bg-blue-200">
              <CameraOutlined className="mr-2" />
              拍照
            </Button>
            <Button className="flex-1 bg-green-100 text-green-600 hover:bg-green-200">
              <PictureOutlined className="mr-2" />
              相册选择
            </Button>
            <Button className="flex-1 bg-purple-100 text-purple-600 hover:bg-purple-200">
              <VideoCameraOutlined className="mr-2" />
              录制视频
            </Button>
          </div>

          <Upload
            fileList={files}
            onChange={handleFileChange}
            listType="picture-card"
            accept="image/*,video/*"
            multiple
            beforeUpload={() => false}
          >
            <div className="aspect-square flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl">
              <PictureOutlined className="text-gray-400 mb-1" />
              <span className="text-xs text-gray-400">添加图片</span>
            </div>
          </Upload>
        </Card>

        <Card className="rounded-2xl shadow-sm mb-6">
          <h2 className="font-semibold text-gray-700 mb-2">📝 打卡备注</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:border-orange-400"
            rows={3}
            placeholder="说说你完成任务的感受..."
          />
        </Card>

        <Button
          type="primary"
          size="large"
          block
          loading={submitting}
          onClick={handleSubmit}
          icon={<SendOutlined />}
          className="h-14 text-lg font-semibold rounded-2xl"
        >
          提交打卡
        </Button>
      </div>
    </div>
  );
};

export default TaskDetail;