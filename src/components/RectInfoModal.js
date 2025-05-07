import React, { useEffect } from 'react';
import { Modal, Tabs, Space, Tag } from 'antd';
import './RectInfoModal.css';
import MethodTab from './tabs/MethodTab';
import MachineTab from './tabs/MachineTab';
import MaterialTab from './tabs/MaterialTab';
import PersonTab from './tabs/PersonTab';
import EnvironmentTab from './tabs/EnvironmentTab';
import TestTab from './tabs/TestTab';
import useUserInfo from '../hooks/useUserInfo';


const RectInfoModal = ({ selectedRect, setSelectedRect, productLine, workOrderData, materialLotCode }) => {
  // 使用 useUserInfo hook 获取用户信息
  const { userData, fetchUserInfo } = useUserInfo();
  
  // 当选中的矩形或条码变化时，获取用户信息
  useEffect(() => {
    if (selectedRect && materialLotCode && selectedRect.tableName) {
      fetchUserInfo(materialLotCode, selectedRect.tableName);
    }
  }, [selectedRect, materialLotCode, fetchUserInfo]);

  const tabItems = [
    {
      key: '1',
      label: <span style={{ color: '#3A59D1', fontSize: '25px', fontWeight: 500 }}>人</span>,
      children: <PersonTab 
        materialLotCode={materialLotCode} 
        operationName={selectedRect?.tableName || ''} 
      />
    },
    {
      key: '2',
      label: <span style={{ color: '#3D90D7', fontSize: '25px', fontWeight: 500 }}>机</span>,
      children: <MachineTab 
        workOrderData={workOrderData}
        materialLotCode={materialLotCode} 
        operationName={selectedRect?.tableName || ''}
      />
    },
    {
      key: '3',
      label: <span style={{ color: '#4F959D', fontSize: '25px', fontWeight: 500 }}>料</span>,
      children: <MaterialTab 
        materialLotCode={materialLotCode} 
        operationName={selectedRect?.tableName || ''} 
      />
    },
    {
      key: '4',
      label: <span style={{ color: '#7AC6D2', fontSize: '25px', fontWeight: 500 }}>法</span>,
      children: <MethodTab />,
      disabled: true,
    },
    {
      key: '5',
      label: <span style={{ color: '#98D2C0', fontSize: '25px', fontWeight: 500 }}>环</span>,
      children: <EnvironmentTab />,
      disabled: true,
    },
    {
      key: '6',
      label: <span style={{ color: '#006A71', fontSize: '25px', fontWeight: 500 }}>测</span>,
      children: <TestTab 
        materialLotCode={materialLotCode} 
        operationName={selectedRect?.tableName || ''} 
      />
    }
  ];

  const modalTitle = (
    <Space>
      <span style={{ fontSize: '40px', fontWeight: 500 }}>{selectedRect?.text || '工序详情'}</span>
      {productLine && <Tag color="blue">产线: {productLine}</Tag>}
      {materialLotCode && <Tag color="green">条码: {materialLotCode}</Tag>}
      {userData && <Tag color="yellow">操作人: {userData.userName}</Tag>}
      {userData && <Tag color="yellow">工号: {userData.userId}</Tag>}
    </Space>
  );

  return (
    <Modal
      title={modalTitle}
      open={!!selectedRect}
      onCancel={() => setSelectedRect(null)}
      width="100vw"
      style={{ 
        top: 0, 
        paddingBottom: 0, 
        margin: 0, 
        maxWidth: '100vw' 
      }}
      styles={{ 
        body: { 
          padding: '12px',
          height: 'calc(100vh - 120px)', // 调整高度，考虑标题栏高度
          overflow: 'hidden' // 防止模态框主体滚动
        }
      }}
      footer={null}
      centered={false}
      destroyOnClose
      wrapClassName="fullscreen-modal"
    >
      {selectedRect && (
        <Tabs 
          defaultActiveKey="2" 
          items={tabItems}
          style={{ 
            height: '100%', 
            display: 'flex',
            flexDirection: 'column'
          }}
          tabBarStyle={{ marginBottom: '12px' }}
        />
      )}
    </Modal>
  );
};

export default RectInfoModal;