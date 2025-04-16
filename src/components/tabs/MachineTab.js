import React from 'react';
import { Card, Table } from 'antd';

const MachineTab = () => {
  const columns = [
    { title: '设备名称', dataIndex: 'name', key: 'name' },
    { title: '设备状态', dataIndex: 'status', key: 'status' },
    { title: '维护记录', dataIndex: 'maintenance', key: 'maintenance' },
  ];

  const data = [
    { key: '1', name: '设备A', status: '运行中', maintenance: '2024-01-01' },
  ];

  return (
    <Card title="设备信息">
      <Table columns={columns} dataSource={data} />
    </Card>
  );
};

export default MachineTab;