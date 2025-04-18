import React from 'react';
import { Card, Descriptions, Avatar, Tag, Space, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const PersonTab = () => {
  // 模拟数据
  const operatorInfo = {
    name: '张三',
    id: '100001',
    department: '生产部',
    skillLevel: 'A级',
    experience: '5年'
  };

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space align="center" size="large">
          <Avatar size={64} icon={<UserOutlined />} />
          <div>
            <Title level={4} style={{ margin: 0 }}>{operatorInfo.name}</Title>
            <Tag color="blue">工号: {operatorInfo.id}</Tag>
            <Tag color="green">{operatorInfo.department}</Tag>
            <Tag color="gold">技能等级: {operatorInfo.skillLevel}</Tag>
          </div>
        </Space>

        <Descriptions title="基本信息" bordered column={2}>
          <Descriptions.Item label="姓名">{operatorInfo.name}</Descriptions.Item>
          <Descriptions.Item label="工号">{operatorInfo.id}</Descriptions.Item>
          <Descriptions.Item label="部门">{operatorInfo.department}</Descriptions.Item>
          <Descriptions.Item label="技能等级">{operatorInfo.skillLevel}</Descriptions.Item>
          <Descriptions.Item label="工作经验">{operatorInfo.experience}</Descriptions.Item>
        </Descriptions>

      </Space>
    </Card>
  );
};

export default PersonTab;