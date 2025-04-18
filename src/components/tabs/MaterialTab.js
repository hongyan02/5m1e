import React from 'react';
import { Card, Table, Divider, Typography } from 'antd';

const { Title } = Typography;

const MaterialTab = () => {
  // 物料投入表格配置
  const materialColumns = [
    { title: '物料名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '物料编号', dataIndex: 'materialCode', key: 'materialCode' },
    { title: '批次号', dataIndex: 'batchNo', key: 'batchNo' },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier' },
    { title: '投入数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '投入时间', dataIndex: 'inputTime', key: 'inputTime' },
    { title: '操作人员', dataIndex: 'operator', key: 'operator' },
  ];

  const materialData = [
    { 
      key: '1', 
      materialName: '18650电芯', 
      materialCode: 'BAT-18650', 
      batchNo: 'B20240501',
      supplier: '供应商A',
      quantity: '1000',
      inputTime: '2024-05-01 09:00:00',
      operator: '张三'
    },
  ];

  // IQC检验数据表格配置
  const iqcColumns = [
    { title: '检验项目', dataIndex: 'inspectionItem', key: 'inspectionItem' },
    { title: '标准值', dataIndex: 'standardValue', key: 'standardValue' },
    { title: '实测值', dataIndex: 'measuredValue', key: 'measuredValue' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '结果', dataIndex: 'result', key: 'result' },
    { title: '检验人员', dataIndex: 'inspector', key: 'inspector' },
    { title: '检验时间', dataIndex: 'inspectionTime', key: 'inspectionTime' },
  ];

  const iqcData = [
    { 
      key: '1', 
      inspectionItem: '电压', 
      standardValue: '3.7±0.1', 
      measuredValue: '3.68', 
      unit: 'V',
      result: '合格',
      inspector: '李四',
      inspectionTime: '2024-05-01 08:30:00'
    },
    { 
      key: '2', 
      inspectionItem: '内阻', 
      standardValue: '≤30', 
      measuredValue: '28.5', 
      unit: 'mΩ',
      result: '合格',
      inspector: '李四',
      inspectionTime: '2024-05-01 08:35:00'
    },
    { 
      key: '3', 
      inspectionItem: '容量', 
      standardValue: '≥5000', 
      measuredValue: '5120', 
      unit: 'mAh',
      result: '合格',
      inspector: '李四',
      inspectionTime: '2024-05-01 08:40:00'
    },
  ];

  return (
    <Card>
      <Title level={4}>物料投入</Title>
      <Table 
        columns={materialColumns} 
        dataSource={materialData} 
        pagination={false}
        size="small"
      />
      
      <Divider />
      
      <Title level={4}>IQC检验数据</Title>
      <Table 
        columns={iqcColumns} 
        dataSource={iqcData}
        pagination={false}
        size="small"
      />
    </Card>
  );
};

export default MaterialTab;