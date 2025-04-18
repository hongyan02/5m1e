import { useState } from 'react';
import { fetchFlowChartData } from '../services/api';
// import { API_CONFIG } from '../config/apiConfig';

const useFlowChart = () => {
  const [flowChartData, setFlowChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const queryFlowChart = async (materialLotCode) => {
    setLoading(true);
    setError(null);
    
    
    try {
      const data = await fetchFlowChartData(materialLotCode);
      setFlowChartData(data);
    } catch (err) {
      setError('获取流程图数据失败');
    } finally {
      setLoading(false);
    }
  };

  return { flowChartData, loading, error, queryFlowChart };
};

export default useFlowChart;
