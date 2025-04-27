import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG } from '../config/apiConfig';
import axios from 'axios';

/**
 * 工单信息Hook
 * 用于获取和管理工单信息
 */
const useWorkOrder = (workOrderId = null) => {
  const [workOrderData, setWorkOrderData] = useState(null);
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
  
  // 将API响应数据转换为表格数据格式
  const formatWorkOrderData = useCallback((response) => {
    if (!response) return null;
    
    return {
      key: '1',
      orderId: response.WorkOrderNum,
      orderStatus: response.Status,
      planQuantity: response.Qty.toString(),
      actualQuantity: response.ReleasedQty,
      completedQuantity: response.CompletedQty,
      startTime: formatDateTime(response.PlanStartTime),
      endTime: formatDateTime(response.PlanEndTime)
    };
  }, [formatDateTime]);
  
  // 获取工单信息
  // 使用 useCallback 记忆化 fetchWorkOrder 函数
  const fetchWorkOrder = useCallback(async (materialLotCode) => {
    if (!materialLotCode) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // 使用真实API获取数据
      const response = await axios.post(API_CONFIG.endpoints['work-order'], {
        material_lot_code: materialLotCode
      });
      
      if (response.data) {
        const formattedData = formatWorkOrderData(response.data);
        setWorkOrderData(formattedData);
      } else {
        setError('未获取到工单数据');
        setWorkOrderData(null);
      }
    } catch (err) {
      console.error('获取工单信息失败:', err);
      // setError('获取工单信息失败');
      setWorkOrderData(null);
    } finally {
      setLoading(false);
    }
  }, [formatWorkOrderData]); // 添加 formatWorkOrderData 作为依赖
  
  // 当workOrderId变化时自动获取工单信息
  useEffect(() => {
    if (workOrderId) {
      fetchWorkOrder(workOrderId);
    }
  }, [workOrderId, fetchWorkOrder]); // 添加 fetchWorkOrder 作为依赖
  
  return {
    workOrderData,
    loading,
    error,
    fetchWorkOrder
  };
};

export default useWorkOrder;