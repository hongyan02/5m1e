import React, { useEffect } from 'react';
import { Card, Table, Divider, Typography, Empty, Spin } from 'antd';
import useResultParams from '../../hooks/useResultParams';
import useProcessParams from '../../hooks/useProcessParams';

const { Title } = Typography;

const MachineTab = ({ workOrderData: externalWorkOrderData, materialLotCode, operationName }) => {
  // 使用结果参数Hook
  const { resultParamsData, loading: resultLoading, error: resultError, fetchResultParams } = useResultParams();
  
  // 使用过程参数Hook
  const { processParamsData, loading: processLoading, error: processError, fetchProcessParams } = useProcessParams();
  
  // 当组件接收到新的参数时获取数据
  useEffect(() => {
    if (materialLotCode && operationName) {
      fetchResultParams(materialLotCode, operationName);
      fetchProcessParams(materialLotCode, operationName);
    }
  }, [materialLotCode, operationName, fetchResultParams, fetchProcessParams]);
  
  // 工单信息表格配置
  const orderColumns = [
    { title: '工单编号', dataIndex: 'orderId', key: 'orderId' },
    { title: '工单状态', dataIndex: 'orderStatus', key: 'orderStatus' },
    { title: '计划数量', dataIndex: 'planQuantity', key: 'planQuantity' },
    { title: '下达数量', dataIndex: 'actualQuantity', key: 'actualQuantity' },
    { title: '完工数量', dataIndex: 'completedQuantity', key: 'completedQuantity' },
    { title: '计划开始时间', dataIndex: 'startTime', key: 'startTime' },
    { title: '计划结束时间', dataIndex: 'endTime', key: 'endTime' },
  ];

  // 动态生成结果参数表格数据 - 横向展示
  const generateResultParamsTable = () => {
    if (!resultParamsData || resultParamsData.length === 0) {
      return {
        columns: [],
        dataSource: []
      };
    }

    // 创建表格列配置 - 每个参数名称作为一列
    const columns = resultParamsData.map((item, index) => ({
      title: item.columns,
      dataIndex: `param_${index}`,
      key: `param_${index}`,
      width: 150,
      ellipsis: true
    }));

    // 创建表格数据源 - 只有一行，包含所有参数值
    const valuesRow = {};
    resultParamsData.forEach((item, index) => {
      valuesRow[`param_${index}`] = item.rows;
    });

    const dataSource = [
      { key: '0', ...valuesRow }
    ];

    return {
      columns,
      dataSource
    };
  };

  // 动态生成过程参数表格数据 - 横向展示
  const generateProcessParamsTable = () => {
    if (!processParamsData || processParamsData.length === 0) {
      return {
        columns: [],
        dataSource: []
      };
    }

    // 创建表格列配置 - 每个参数名称作为一列
    const columns = processParamsData.map((item, index) => ({
      title: item.columns,
      dataIndex: `param_${index}`,
      key: `param_${index}`,
      width: 150,
      ellipsis: true
    }));

    // 创建表格数据源 - 只有一行，包含所有参数值
    const valuesRow = {};
    processParamsData.forEach((item, index) => {
      valuesRow[`param_${index}`] = item.rows;
    });

    const dataSource = [
      { key: '0', ...valuesRow }
    ];

    return {
      columns,
      dataSource
    };
  };

  const resultParamsTable = generateResultParamsTable();
  const processParamsTable = generateProcessParamsTable();

  // 渲染结果参数表格
  const renderResultParamsTable = () => {
    if (resultLoading) {
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
          <p style={{ marginTop: '10px' }}>正在加载结果参数...</p>
        </div>
      );
    }

    if (resultError) {
      return <div style={{ color: 'red', marginBottom: '10px' }}>{resultError}</div>;
    }

    return (
      <Table 
        columns={resultParamsTable.columns} 
        dataSource={resultParamsTable.dataSource} 
        pagination={false}
        size="small"
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: <Empty description="暂无结果参数数据" /> }}
      />
    );
  };

  // 渲染过程参数表格
  const renderProcessParamsTable = () => {
    if (processLoading) {
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
          <p style={{ marginTop: '10px' }}>正在加载过程参数...</p>
        </div>
      );
    }

    if (processError) {
      return <div style={{ color: 'red', marginBottom: '10px' }}>{processError}</div>;
    }

    return (
      <Table 
        columns={processParamsTable.columns} 
        dataSource={processParamsTable.dataSource} 
        pagination={false}
        size="small"
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: <Empty description="暂无过程参数数据" /> }}
      />
    );
  };

  return (
    <Card>
      <Title level={4}>工单信息</Title>
        <Table 
          columns={orderColumns} 
          dataSource={externalWorkOrderData ? [externalWorkOrderData] : []} 
          pagination={false}
          size="small"
          locale={{ emptyText: <Empty description="暂无工单数据" /> }}
        />
      
      <Divider />
      
      <Title level={4}>过程参数</Title>
      {renderProcessParamsTable()}
      
      <Divider />
      
      <Title level={4}>结果参数</Title>
      {renderResultParamsTable()}
    </Card>
  );
};

export default MachineTab;