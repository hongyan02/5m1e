import React, { useEffect } from 'react';
import { Card, Table, Typography, Empty } from 'antd';
import useInspectionData from '../../hooks/useInspectionData';

const { Title } = Typography;

const TestTab = ({ materialLotCode, operationName }) => {
  const { inspectionData, loading, error, fetchInspectionData } = useInspectionData();
  
  useEffect(() => {
    if (materialLotCode && operationName) {
      fetchInspectionData(materialLotCode, operationName);
    }
  }, [materialLotCode, operationName, fetchInspectionData]);

  const columns = [
    {
      title: '检验单号',
      dataIndex: 'inspectionCode',
      key: 'inspectionCode',
    },
    {
      title: '检验状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '生产日期',
      dataIndex: 'productionDate',
      key: 'productionDate',
    },
    {
      title: '检验人员',
      dataIndex: 'inspectionBy',
      key: 'inspectionBy',
    },
    {
      title: '检验日期',
      dataIndex: 'inspectionDate',
      key: 'inspectionDate',
    },
    {
      title: '检验结果',
      dataIndex: 'result',
      key: 'result',
    },
    {
      title: '检验类别',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '工序名称',
      dataIndex: 'operation',
      key: 'operation',
    },
  ];

  return (
    <Card>
      <Title level={4}>检验信息</Title>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <Table
        columns={columns}
        dataSource={inspectionData}
        loading={loading}
        pagination={{ pageSize: 5 }}
        size="small"
        locale={{ emptyText: <Empty description="暂无检验数据" /> }}
      />
    </Card>
  );
};

export default TestTab;