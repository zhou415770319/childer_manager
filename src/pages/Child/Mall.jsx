import { useState } from 'react';
import { Card, Button, Badge, message, Modal } from 'antd';
import { ArrowLeftOutlined, StarOutlined, ShoppingCartOutlined, XOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/appStore';

const categories = ['全部', '文具', '玩具', '图书', '其他'];

const GiftCard = ({ gift, onExchange }) => {
  const { stats } = useStore();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (stats.totalPoints >= gift.price) {
      setShowModal(true);
    } else {
      message.warning('积分不足！');
    }
  };

  return (
    <>
      <Card className="rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-square bg-gray-100 mb-3">
          <img 
            src={gift.imageUrl} 
            alt={gift.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-semibold text-gray-800">{gift.name}</h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{gift.description}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-yellow-500 font-bold">
            <StarOutlined />
            <span>{gift.price}</span>
          </div>
          <Badge count={gift.stock} className="bg-green-500" />
        </div>
        <Button
          type="primary"
          block
          size="small"
          onClick={handleClick}
          disabled={stats.totalPoints < gift.price}
          className="mt-3"
        >
          <ShoppingCartOutlined className="mr-1" />
          兑换
        </Button>
      </Card>

      <Modal
        title={gift.name}
        visible={showModal}
        footer={null}
        onCancel={() => setShowModal(false)}
      >
        <img src={gift.imageUrl} alt={gift.name} className="w-full h-48 object-cover rounded-lg mb-4" />
        <p className="text-gray-600 mb-4">{gift.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-yellow-500 font-bold">
            <StarOutlined />
            <span>{gift.price} 积分</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowModal(false)}>取消</Button>
            <Button 
              type="primary" 
              onClick={() => {
                onExchange(gift);
                setShowModal(false);
              }}
            >
              确认兑换
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const Mall = () => {
  const navigate = useNavigate();
  const { gifts, stats } = useStore();
  const [activeCategory, setActiveCategory] = useState('全部');

  const filteredGifts = activeCategory === '全部' 
    ? gifts 
    : gifts.filter(g => g.category === activeCategory);

  const handleExchange = (gift) => {
    message.success(`成功兑换 ${gift.name}！请等待家长确认发货`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 pb-20">
      <header className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/child/home')}
            className="flex items-center gap-2 text-gray-600"
          >
            <ArrowLeftOutlined />
            <span>返回</span>
          </button>
          <h1 className="text-xl font-bold text-gray-800">🎁 积分商城</h1>
          <div className="bg-yellow-100 px-3 py-1 rounded-full">
            <div className="flex items-center gap-1">
              <StarOutlined className="text-yellow-500" />
              <span className="text-yellow-600 font-bold">{stats.totalPoints}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredGifts.map((gift) => (
            <GiftCard key={gift.id} gift={gift} onExchange={handleExchange} />
          ))}
        </div>

        {filteredGifts.length === 0 && (
          <Card className="text-center py-12">
            <XOutlined className="text-gray-300 text-4xl mb-2" />
            <p className="text-gray-500">暂无商品</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Mall;