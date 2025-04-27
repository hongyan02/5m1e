import React, { useState } from 'react';
import { Layout, Input, Button, Space, Typography, Alert, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './MainLayout.css';
import useProductLine from '../hooks/useProductLine';
import useSvgInteraction from '../hooks/useSvgInteraction';
import useWorkOrder from '../hooks/useWorkOrder';
import RectInfoModal from './RectInfoModal';

const { Header, Content } = Layout;
const { Text } = Typography;

const MainLayout = ({ children }) => {
  const [barcode, setBarcode] = useState('');
  const { 
    productLine, 
    loading: productLineLoading, 
    error: productLineError, 
    queryProductLine 
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
  
  const handleSearch = () => {
    if (!barcode.trim()) return;
    queryProductLine(barcode);
    fetchWorkOrder(barcode); // 同时获取工单信息
  };
  
  // 计算加载状态
  const isLoading = productLineLoading || workOrderLoading;
  
  return (
    <Layout className="main-layout">
      <Header className="main-header" style={{ height: 'auto', padding: '16px 0' }}>
        <div className="header-container">
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
                <Text strong style={{ color: '#000' }}>产线：<Text type="secondary">{productLine}</Text></Text>
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
              data={process.env.PUBLIC_URL + "/123.svg"} 
              type="image/svg+xml"
              aria-label="电芯生产流程图"
              style={{ 
                width: '85%',
                height: '85%',
                transform: 'scale(0.85)',
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
        workOrderData={workOrderData}  // 传递工单数据
        materialLotCode={barcode}  
      />
    </Layout>
  );
};

export default MainLayout;