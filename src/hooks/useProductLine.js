import { useState } from 'react';
import axios from 'axios';
import { PROD_LINE_MAPPING, API_CONFIG } from '../config/apiConfig';

const useProductLine = () => {
  const [productLine, setProductLine] = useState('待查询');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // 添加成功和失败消息状态
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 将产线代码映射为产线名称
  const mapProductLine = (code) => {
    return PROD_LINE_MAPPING[code] || code; // 如果没有映射，则返回原始代码
  };

  const queryProductLine = async (materialLotCode) => {
    setLoading(true);
    setError(null);
    // 重置消息状态
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      const response = await axios.post(API_CONFIG.endpoints.productLine, {
        material_lot_code: materialLotCode
      });
      
      if (response.data && response.data.prod_line_code) {
        // 使用映射将产线代码转换为产线名称
        const mappedProductLine = mapProductLine(response.data.prod_line_code);
        setProductLine(mappedProductLine);
        // 设置成功消息
        setSuccessMessage(`成功获取产线信息: ${mappedProductLine}`);
      } else {
        setProductLine('未知产线');
        // 设置失败消息
        setErrorMessage('未找到产线信息');
      }
    } catch (err) {
      console.error('获取产线信息失败:', err);
      setError('获取产线信息失败');
      setProductLine('查询失败');
      // 设置错误消息
      setErrorMessage('获取产线信息失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  return { 
    productLine, 
    loading, 
    error, 
    queryProductLine,
    successMessage,
    errorMessage
  };
};

export default useProductLine;