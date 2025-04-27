import React from 'react';
import { Card, Table, Divider, Typography, Empty, Spin } from 'antd';
import useMaterialFeeding from '../../hooks/useMaterialFeeding';

const { Title } = Typography;

const MaterialTab = ({ materialLotCode, operationName }) => {
  // 使用物料投入Hook
  const { materialFeedingData, loading, error, fetchMaterialFeeding } = useMaterialFeeding();
  
  // 当组件接收到新的参数时获取数据
  React.useEffect(() => {
    if (materialLotCode && operationName) {
      fetchMaterialFeeding(materialLotCode, operationName);
    }
  }, [materialLotCode, operationName, fetchMaterialFeeding]);
  
  // 物料投入表格配置
  const materialColumns = [
    { title: '物料名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '物料编号', dataIndex: 'materialCode', key: 'materialCode' },
    { title: '批次号', dataIndex: 'batchNo', key: 'batchNo' },
    { title: '投入数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '投入时间', dataIndex: 'inputTime', key: 'inputTime' },
    { title: '操作人员', dataIndex: 'operator', key: 'operator' },
    { title: '设备编号', dataIndex: 'equipCode', key: 'equipCode' },
    { title: '工序名称', dataIndex: 'operationName', key: 'operationName' },
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

  // 渲染加载状态
  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
          <p style={{ marginTop: '10px' }}>正在加载物料投入信息...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Title level={4}>物料投入</Title>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <Table 
        columns={materialColumns} 
        dataSource={materialFeedingData} 
        pagination={false}
        size="small"
        locale={{ emptyText: <Empty description="暂无物料投入数据" /> }}
      />
      
      <Divider />
      
      <Title level={4}>IQC检验数据</Title>
      <Table 
        columns={iqcColumns} 
        dataSource={[]} 
        pagination={false}
        size="small"
        locale={{ emptyText: <Empty description="暂无检验数据" /> }}
      />
    </Card>
  );
};

export default MaterialTab;