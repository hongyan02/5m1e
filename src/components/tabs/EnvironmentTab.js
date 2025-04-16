import React from 'react';
import { Card } from 'antd';

const EnvironmentTab = () => {
  return (
    <Card title="环境信息">
      <p>温度要求: 未设置</p>
      <p>湿度要求: 未设置</p>
      <p>洁净度: 未设置</p>
      <p>环境监控: 未设置</p>
    </Card>
  );
};

export default EnvironmentTab;