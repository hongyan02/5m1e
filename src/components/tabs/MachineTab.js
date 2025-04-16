import React from 'react';
import { Card, Table, Divider, Typography } from 'antd';

const { Title } = Typography;

const MachineTab = () => {
  // 工单信息表格配置
  const orderColumns = [
    { title: '工单编号', dataIndex: 'orderId', key: 'orderId' },
    { title: '工单状态', dataIndex: 'orderStatus', key: 'orderStatus' },
    { title: '计划数量', dataIndex: 'planQuantity', key: 'planQuantity' },
    { title: '完工数量', dataIndex: 'completedQuantity', key: 'completedQuantity' },
    { title: '计划开始时间', dataIndex: 'startTime', key: 'startTime' },
    { title: '计划结束时间', dataIndex: 'endTime', key: 'endTime' },
  ];

  const orderData = [
    { 
      key: '1', 
      orderId: 'WO-20240501-001', 
      orderStatus: '生产中', 
      planQuantity: '1000', 
      completedQuantity: '750',
      startTime: '2024-05-01 08:00:00',
      endTime: '2024-05-05 17:00:00'
    },
  ];

  // 结果参数表格配置
  const resultColumns = [
    { title: '上正极厚度', dataIndex: 'positiveThickness', key: 'positiveThickness' },
    { title: '右下V角深', dataIndex: 'vCornerDepth', key: 'vCornerDepth' },
    { title: '厚度结果', dataIndex: 'thicknessResult', key: 'thicknessResult' },
    { title: 'hipot阻值', dataIndex: 'hipotResistance', key: 'hipotResistance' },
    { title: 'hipot测试电压', dataIndex: 'hipotVoltage', key: 'hipotVoltage' },
  ];

  const resultData = [
    { 
      key: '1', 
      positiveThickness: '0.25mm', 
      vCornerDepth: '0.12mm', 
      thicknessResult: '合格', 
      hipotResistance: '15MΩ',
      hipotVoltage: '500V'
    },
    { 
      key: '2', 
      positiveThickness: '0.26mm', 
      vCornerDepth: '0.11mm', 
      thicknessResult: '合格', 
      hipotResistance: '16MΩ',
      hipotVoltage: '500V'
    },
    { 
      key: '3', 
      positiveThickness: '0.24mm', 
      vCornerDepth: '0.13mm', 
      thicknessResult: '合格', 
      hipotResistance: '14MΩ',
      hipotVoltage: '500V'
    },
  ];

  return (
    <Card>
      <Title level={4}>工单信息</Title>
      <Table 
        columns={orderColumns} 
        dataSource={orderData} 
        pagination={false}
        size="small"
      />
      
      <Divider />
      
      <Title level={4}>结果参数</Title>
      <Table 
        columns={resultColumns} 
        dataSource={resultData}
        pagination={false}
        size="small"
      />
    </Card>
  );
};

export default MachineTab;