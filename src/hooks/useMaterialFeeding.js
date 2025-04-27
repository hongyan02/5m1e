import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_CONFIG, PROCESS_NAME } from '../config/apiConfig';

/**
 * 物料投入Hook
 * 用于获取和管理物料投入信息
 */
const useMaterialFeeding = () => {
  const [materialFeedingData, setMaterialFeedingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
    // 映射工序名称
    const mapProcessName = (code) => {
      return PROCESS_NAME[code] || code; // 如果没有映射，则返回原始代码
    };

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
  const formatMaterialFeedingData = useCallback((responseData) => {
    if (!responseData || !responseData.material_feedings || !Array.isArray(responseData.material_feedings)) {
      return [];
    }
    
    return responseData.material_feedings.map((item, index) => ({
      key: index.toString(),
      materialName: item.MaterialName || '',
      materialCode: item.MaterialCode || '',
      batchNo: item.MaterialLotCode || '',
      quantity: item.Qty ? item.Qty.toString() : '',
      inputTime: formatDateTime(item.FeedingTime), 
      operator: item.FeedingPerson || '',
      equipCode: item.EquipCode || '',
      operationName: mapProcessName(item.OperationName) || ''
    }));
  }, [formatDateTime]); 
  
  // 获取物料投入信息
  const fetchMaterialFeeding = useCallback(async (materialLotCode, operationName) => {
    if (!materialLotCode || !operationName) {
      console.error('获取物料投入信息失败: 缺少必要参数');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 调用物料投入API
      const response = await axios.post(API_CONFIG.endpoints.materialFeeding, {
        material_lot_code: materialLotCode,
        operation_name: operationName
      });
      
      if (response.data) {
        const formattedData = formatMaterialFeedingData(response.data); // 使用 formatMaterialFeedingData
        setMaterialFeedingData(formattedData);
      } else {
        setError('未获取到物料投入数据');
        setMaterialFeedingData([]);
      }
    } catch (err) {
      console.error('获取物料投入信息失败:', err);
      setError('获取物料投入信息失败');
      setMaterialFeedingData([]);
    } finally {
      setLoading(false);
    }
  }, [formatMaterialFeedingData]); 
  
  return {
    materialFeedingData,
    loading,
    error,
    fetchMaterialFeeding
  };
};

export default useMaterialFeeding;