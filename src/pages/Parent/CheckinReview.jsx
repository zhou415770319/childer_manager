import { useState } from 'react';
import { Card, Button, Input, Modal, message, Badge, Avatar } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import useStore from '../../store/appStore';
import { getStatusLabel } from '../../utils/helpers';

const CheckinReview = () => {
  const { checkins, setCheckins } = useStore();
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [points, setPoints] = useState(0);
  const [comment, setComment] = useState('');

  const handleViewDetail = (checkin) => {
    setSelectedCheckin(checkin);
    setPoints(checkin.basePoints || 0);
    setComment('');
    setShowModal(true);
  };

  const handleApprove = () => {
    if (!selectedCheckin) return;
    
    setCheckins(prev => prev.map(c => 
      c.id === selectedCheckin.id 
        ? { ...c, reviewStatus: 'approved', finalPoints: points, parentComment: comment }
        : c
    ));
    
    message.success('审核通过，已发放积分');
    setShowModal(false);
  };

  const handleReject = () => {
    if (!selectedCheckin) return;
    
    setCheckins(prev => prev.map(c => 
      c.id === selectedCheckin.id 
        ? { ...c, reviewStatus: 'rejected', finalPoints: 0, parentComment: comment }
        : c
    ));
    
    message.success('已拒绝打卡');
    setShowModal(false);
  };

  const pendingCheckins = checkins.filter(c => c.reviewStatus === 'pending');
  const approvedCheckins = checkins.filter(c => c.reviewStatus === 'approved');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">📋 打卡审核</h1>
        <div className="flex gap-2">
          <Badge count={pendingCheckins.length} className="bg-orange-500" />
          <span className="text-gray-500">待审核</span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold text-gray-700 mb-3">待审核 ({pendingCheckins.length})</h2>
        
        {pendingCheckins.length > 0 ? (
          <div className="space-y-3">
            {pendingCheckins.map((checkin) => (
              <Card key={checkin.id} className="rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar icon={<UserOutlined />} />
                    <div>
                      <div className="font-medium text-gray-800">{checkin.childName || '小明'}</div>
                      <div className="text-gray-500 text-sm">
                        {checkin.taskName || '任务'} - {new Date(checkin.checkinTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {checkin.aiScore && (
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-yellow-500 font-bold">
                          <StarOutlined />
                          <span>{checkin.aiScore}</span>
                        </div>
                        <div className="text-gray-400 text-xs">AI评分</div>
                      </div>
                    )}
                    <Button size="small" onClick={() => handleViewDetail(checkin)}>
                      <EyeOutlined /> 查看详情
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CheckCircleOutlined className="text-green-500 text-4xl mb-2" />
            <p className="text-gray-500">暂无待审核打卡</p>
          </Card>
        )}
      </div>

      <div>
        <h2 className="font-semibold text-gray-700 mb-3">已审核 ({approvedCheckins.length})</h2>
        
        {approvedCheckins.length > 0 ? (
          <div className="space-y-3">
            {approvedCheckins.map((checkin) => (
              <Card key={checkin.id} className="rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar icon={<UserOutlined />} />
                    <div>
                      <div className="font-medium text-gray-800">{checkin.childName || '小明'}</div>
                      <div className="text-gray-500 text-sm">
                        {checkin.taskName || '任务'} - {new Date(checkin.checkinTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-green-500 font-bold">
                        <StarOutlined />
                        <span>{checkin.finalPoints}</span>
                      </div>
                      <div className="text-gray-400 text-xs">获得积分</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      checkin.reviewStatus === 'approved' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {getStatusLabel(checkin.reviewStatus)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CloseCircleOutlined className="text-gray-300 text-4xl mb-2" />
            <p className="text-gray-500">暂无已审核记录</p>
          </Card>
        )}
      </div>

      <Modal
        title="打卡详情"
        visible={showModal}
        footer={null}
        onCancel={() => setShowModal(false)}
        width={500}
      >
        {selectedCheckin && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar icon={<UserOutlined />} />
              <div>
                <div className="font-medium">小明</div>
                <div className="text-gray-500 text-sm">语文作业 - {new Date(selectedCheckin.checkinTime).toLocaleString()}</div>
              </div>
            </div>

            {selectedCheckin.aiComment && (
              <Card className="bg-blue-50">
                <div className="font-medium text-gray-700 mb-1">AI评语</div>
                <p className="text-gray-600">{selectedCheckin.aiComment}</p>
              </Card>
            )}

            {selectedCheckin.content && (
              <div>
                <div className="font-medium text-gray-700 mb-1">打卡内容</div>
                <p className="text-gray-600">{selectedCheckin.content}</p>
              </div>
            )}

            <div>
              <div className="font-medium text-gray-700 mb-2">发放积分</div>
              <Input 
                type="number" 
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                placeholder="请输入积分数量"
              />
            </div>

            <div>
              <div className="font-medium text-gray-700 mb-2">家长评语</div>
              <Input.TextArea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                placeholder="输入评语（可选）"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button onClick={() => setShowModal(false)}>取消</Button>
              <Button onClick={handleReject} danger>拒绝</Button>
              <Button type="primary" onClick={handleApprove}>通过</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CheckinReview;