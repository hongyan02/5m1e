import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

/**
 * 结果参数Hook
 * 用于获取和管理结果参数信息
 */

const useResultParams = () => {
  const [resultParamsData, setResultParamsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 获取结果参数
  const fetchResultParams = useCallback(async (materialLotCode, operationName) => {
    if (!materialLotCode || !operationName) {
      console.error('获取结果参数失败: 缺少必要参数');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 调用结果参数API
      const response = await axios.post(API_CONFIG.endpoints['result-params'], {
        material_lot_code: materialLotCode,
        operation_name: operationName
      });
      
      if (response.data && response.data.resultParameters) {
        setResultParamsData(response.data.resultParameters);
      } else {
        setError('未获取到结果参数数据');
        setResultParamsData([]);
      }
    } catch (err) {
      console.error('获取结果参数失败:', err);
      // setError('获取结果参数失败');
      setResultParamsData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    resultParamsData,
    loading,
    error,
    fetchResultParams
  };
};

export default useResultParams;