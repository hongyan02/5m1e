import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Space, Alert, Row, Col, Tag, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './MainLayout.css';
import useProductLine from '../hooks/useProductLine';
import useSvgInteraction from '../hooks/useSvgInteraction';
import useWorkOrder from '../hooks/useWorkOrder';
import RectInfoModal from './RectInfoModal';

const { Header, Content } = Layout;
// const { Text } = Typography;

const MainLayout = ({ children }) => {
  // 使用 message 钩子
  const [messageApi, contextHolder] = message.useMessage();
  
  const [barcode, setBarcode] = useState('');
  const { 
    productLine, 
    loading: productLineLoading, 
    error: productLineError, 
    queryProductLine,
    successMessage,
    errorMessage
  } = useProductLine();
  
  // 使用工单信息Hook
  const {
    workOrderData,
    loading: workOrderLoading,
    error: workOrderError,
    fetchWorkOrder
  } = useWorkOrder();
  
  // 使用基础的SVG交互Hook
  const { 
    selectedRect, 
    setSelectedRect, 
    handleSvgLoad
  } = useSvgInteraction();
  
  // 监听消息状态变化并显示全局消息
  useEffect(() => {
    console.log('successMessage:', successMessage);
    if (successMessage) {
      messageApi.success({
        content: successMessage,
        duration: 3,
        style: { marginTop: '20px' }
      });
    }
  }, [successMessage, messageApi]);

  useEffect(() => {
    if (errorMessage) {
      messageApi.error({
        content: errorMessage,
        duration: 3,
        style: { marginTop: '20px' }
      });
    }
  }, [errorMessage, messageApi]);
  
  const handleSearch = () => {
    if (!barcode.trim()) {
      messageApi.warning('请输入电芯条码');
      return;
    }
    queryProductLine(barcode);
    fetchWorkOrder(barcode); // 同时获取工单信息
  };
  
  // 计算加载状态
  const isLoading = productLineLoading || workOrderLoading;
  
  return (
    <Layout className="main-layout">
      {/* 在组件树的顶层插入 contextHolder */}
      {contextHolder}
      
      <Header className="main-header" style={{ height: 'auto', padding: '16px 0' }}>
        <div className="header-container" style={{ paddingLeft: '40px', display: 'flex', justifyContent: 'flex-start' }}>
          <Row gutter={[0, 16]} align="middle">
            {/* <Col span={24}>
              <Text style={{ fontSize: '20px', color: '#000' }}>电芯生产流程追踪</Text>
            </Col> */}
            <Col span={24}>
              <Space size="middle" style={{ height: '32px' }}>
                <Input 
                  placeholder="请输入电芯条码" 
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  style={{ width: 250 }}
                  onPressEnter={handleSearch}
                />
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                  loading={isLoading}
                >
                  查询
                </Button>
                {productLineError && <Alert message={productLineError} type="error" showIcon />}
                {workOrderError && <Alert message={workOrderError} type="error" showIcon />}
                {/* <Text strong style={{ color: '#000' }}>产线：<Text type="secondary">{productLine}</Text></Text> */}
                {productLine && <Tag color="blue">产线: {productLine}</Tag>}
              </Space>
            </Col>
          </Row>
        </div>
      </Header>
      <Content className="main-content">
        <div className="content-container" style={{ padding: 0 }}>
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            overflow: 'auto',
            padding: 20,
          }}>
            <object 
              data={process.env.PUBLIC_URL + "/final.svg"} 
              type="image/svg+xml"
              aria-label="电芯生产流程图"
              style={{ 
                width: '90%',
                height: '90%',
                transform: 'scale(0.90)',
                transformOrigin: 'top center'
              }}
              onLoad={handleSvgLoad}
            />
          </div>
          {children}
        </div>
      </Content>

      <RectInfoModal 
        selectedRect={selectedRect} 
        setSelectedRect={setSelectedRect} 
        productLine={productLine}
        workOrderData={workOrderData}
        materialLotCode={barcode}  
      />
    </Layout>
  );
};

export default MainLayout;