import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

const useUserInfo = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 格式化日期时间
  const formatDateTime = useCallback((dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }, []);
  
  // 将API响应数据转换为所需格式
  const formatUserData = useCallback((responseData) => {
    if (!responseData) return null;
    
    return {
      userId: responseData.user_name || '',
      userName: responseData.user_id || '',
      department: responseData.department || '生产部',
      skillLevel: responseData.skill_level || 'A级',
      experience: responseData.experience || '5年',
      operationTime: formatDateTime(responseData.operation_time)
    };
  }, [formatDateTime]);
  
  // 获取用户信息
  const fetchUserInfo = useCallback(async (materialLotCode, operationName) => {
    if (!materialLotCode || !operationName) {
      console.error('获取用户信息失败: 缺少必要参数');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 调用用户信息API
      const response = await axios.post(API_CONFIG.endpoints.user, {
        material_lot_code: materialLotCode,
        mt_data_record_code: operationName
      });
      
      if (response.data) {
        const formattedData = formatUserData(response.data);
        setUserData(formattedData);
      } else {
        setError('未获取到用户数据');
        setUserData(null);
      }
    } catch (err) {
      console.error('获取用户信息失败:', err);
      // setError('获取用户信息失败');
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, [formatUserData]);
  
  return {
    userData,
    loading,
    error,
    fetchUserInfo
  };
};

export default useUserInfo;