import { useState, useCallback } from 'react';
import axios from 'axios';

/**
 * 检验数据Hook
 * 用于获取和管理检验数据信息
 */
const useInspectionData = () => {
  const [inspectionData, setInspectionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 格式化日期时间
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch (error) {
      return dateString;
    }
  }, []);
  
  // 将API响应数据转换为表格数据格式
  const formatInspectionData = useCallback((responseData) => {
    if (!responseData || !responseData.inspection_records || !Array.isArray(responseData.inspection_records)) {
      return [];
    }
    
    return responseData.inspection_records.map((item, index) => ({
      key: index.toString(),
      inspectionCode: item.InspectionRecordCode,
      status: item.InspectionStatus,
      productionDate: formatDate(item.ProductionDate),
      inspectionBy: item.InspectionBy,
      inspectionDate: formatDate(item.InspectionDate),
      result: item.InspectionResult,
      category: item.IdentifyCategory,
      operation: item.OperationName
    }));
  }, [formatDate]);
  
  // 获取检验数据
  const fetchInspectionData = useCallback(async (materialLotCode, operationName) => {
    if (!materialLotCode || !operationName) {
      console.error('获取检验数据失败: 缺少必要参数');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 调用检验数据API
      const response = await axios.post(
        'http://10.22.161.62:8083/api/5m1e/inspection',
        {
          material_lot_code: materialLotCode,
          operation_name: operationName
        }
      );
      
      if (response.data) {
        const formattedData = formatInspectionData(response.data);
        setInspectionData(formattedData);
      } else {
        setError('未获取到检验数据');
        setInspectionData([]);
      }
    } catch (err) {
      console.error('获取检验数据失败:', err);
      setError('获取检验数据失败');
      setInspectionData([]);
    } finally {
      setLoading(false);
    }
  }, [formatInspectionData]);
  
  return {
    inspectionData,
    loading,
    error,
    fetchInspectionData
  };
};

export default useInspectionData;