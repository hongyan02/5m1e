import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

/**
 * 过程参数Hook
 * 用于获取和管理过程参数信息
 */
const useProcessParams = () => {
  const [processParamsData, setProcessParamsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 获取过程参数
  const fetchProcessParams = useCallback(async (materialLotCode, operationName) => {
    if (!materialLotCode || !operationName) {
      console.error('获取过程参数失败: 缺少必要参数');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 调用过程参数API
      const response = await axios.post(API_CONFIG.endpoints['process-params'], {
        material_lot_code: materialLotCode,
        operation_name: operationName
      });
      
      if (response.data) {
        setProcessParamsData(response.data);
      } else {
        setError('未获取到过程参数数据');
        setProcessParamsData([]);
      }
    } catch (err) {
      console.error('获取过程参数失败:', err);
    //   setError('获取过程参数失败');
      setProcessParamsData([]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    processParamsData,
    loading,
    error,
    fetchProcessParams
  };
};

export default useProcessParams;