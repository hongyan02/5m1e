import React from 'react';
import { Layout, Input, Button, Space, Typography, Alert, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './MainLayout.css';
import useBarcodeSearch from '../hooks/useBarcodeSearch';
import useSvgInteraction from '../hooks/useSvgInteraction';
import RectInfoModal from './RectInfoModal';

const { Header, Content } = Layout;
const { Text } = Typography;

const MainLayout = ({ children }) => {
  const { 
    barcode, 
    setBarcode, 
    handleSearch, 
    isLoading, 
    error, 
    productLine,
    workOrderData 
  } = useBarcodeSearch();
  
  // 使用基础的SVG交互Hook，移除用户相关逻辑
  const { 
    selectedRect, 
    setSelectedRect, 
    handleSvgLoad
  } = useSvgInteraction();
  
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
                {error && <Alert message={error} type="error" showIcon />}
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
        workOrderData={workOrderData}
        materialLotCode={barcode}  
      />
    </Layout>
  );
};

export default MainLayout;