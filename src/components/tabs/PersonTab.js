import React, { useEffect } from 'react';
import { Card, Descriptions, Avatar, Tag, Space, Typography, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import useUserInfo from '../../hooks/useUserInfo';

const { Title } = Typography;

const PersonTab = ({ materialLotCode, operationName }) => {
  const { userData, loading, error, fetchUserInfo } = useUserInfo();
  
  useEffect(() => {
    if (materialLotCode && operationName) {
      fetchUserInfo(materialLotCode, operationName);
    }
  }, [materialLotCode, operationName, fetchUserInfo]);

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
          <p style={{ marginTop: '10px' }}>正在加载用户信息...</p>
        </div>
      </Card>
    );
  }

  // 显示错误信息
  if (error) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </Card>
    );
  }

  // 使用API返回的数据或默认数据
  const operatorInfo = userData ? {
    name: userData.userName || '未知',  // 修改：使用 userName 作为姓名
    id: userData.userId || '未知',  // 修改：使用 userId 作为工号
    department: userData.department || '未知',
    skillLevel: userData.skillLevel || '未知',
    experience: userData.experience || '未知',
    operationTime: userData.operationTime || '未知'
  } : {
    name: '未获取到用户',
    id: '未知',
    department: '未知',
    skillLevel: '未知',
    experience: '未知',
    operationTime: '未知'
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
          <Descriptions.Item label="操作时间">{operatorInfo.operationTime}</Descriptions.Item>
        </Descriptions>
      </Space>
    </Card>
  );
};

export default PersonTab;