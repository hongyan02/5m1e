import React from 'react';
import { Modal, Tabs, Space, Tag } from 'antd';
import './RectInfoModal.css';
import MethodTab from './tabs/MethodTab';
import MachineTab from './tabs/MachineTab';
import MaterialTab from './tabs/MaterialTab';
import PersonTab from './tabs/PersonTab';
import EnvironmentTab from './tabs/EnvironmentTab';
import TestTab from './tabs/TestTab';


const RectInfoModal = ({ selectedRect, setSelectedRect, productLine, workOrderData, userData, userLoading, materialLotCode }) => {

  const tabItems = [
    {
      key: '1',
      label: '工艺方法',
      children: <MethodTab />
    },
    {
      key: '2',
      label: '设备信息',
      children: <MachineTab workOrderData={workOrderData} />
    },
    {
      key: '3',
      label: '物料信息',
      children: <MaterialTab 
        materialLotCode={materialLotCode} 
        operationName={selectedRect?.tableName || ''} 
      />
    },
    {
      key: '4',
      label: '人员信息',
      children: <PersonTab 
        materialLotCode={materialLotCode} 
        operationName={selectedRect?.tableName || ''} 
      />
    },
    {
      key: '5',
      label: '环境信息',
      children: <EnvironmentTab />
    },
    {
      key: '6',
      label: '测试信息',
      children: <TestTab 
        materialLotCode={materialLotCode} 
        operationName={selectedRect?.tableName || ''} 
      />
    }
  ];

  const modalTitle = (
    <Space>
      <span>{selectedRect?.text || '工序详情'}</span>
      {productLine && <Tag color="blue">产线: {productLine}</Tag>}
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
          height: 'calc(100vh - 55px)', 
          padding: '12px', 
          overflow: 'auto' 
        }
      }}
      footer={null}
      centered={false}
      destroyOnClose
      wrapClassName="fullscreen-modal"
    >
      {selectedRect && (
        <Tabs defaultActiveKey="1" items={tabItems} />
      )}
    </Modal>
  );
};

export default RectInfoModal;