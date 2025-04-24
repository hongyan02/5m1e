import { useState } from 'react';
import useProductLine from './useProductLine';
import useFlowChart from './useFlowChart';
import useWorkOrder from './useWorkOrder';

const useBarcodeSearch = () => {
  const [barcode, setBarcode] = useState('');
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  
  // 引入各个功能的hooks
  const productLineHook = useProductLine();
  const flowChartHook = useFlowChart();
  const workOrderHook = useWorkOrder();
  
  const handleSearch = async () => {
    if (!barcode.trim()) return;
    
    setGlobalLoading(true);
    setGlobalError(null);
    
    try {
      // 并行调用多个API
      await Promise.all([
        productLineHook.queryProductLine(barcode),
        flowChartHook.queryFlowChart(barcode),
        workOrderHook.fetchWorkOrder(barcode),
        // 可以添加更多API调用
      ]);
    } catch (error) {
      setGlobalError('查询过程中发生错误');
      console.error('查询错误:', error);
    } finally {
      setGlobalLoading(false);
    }
  };
  
  // 汇总所有hooks的loading状态
  const isLoading = globalLoading || productLineHook.loading || flowChartHook.loading || workOrderHook.loading;
  
  // 汇总所有hooks的error状态
  const error = globalError || productLineHook.error || flowChartHook.error || workOrderHook.error;
  
  return {
    barcode,
    setBarcode,
    handleSearch,
    isLoading,
    error,
    productLine: productLineHook.productLine,
    flowChartData: flowChartHook.flowChartData,
    workOrderData: workOrderHook.workOrderData,
  };
};

export default useBarcodeSearch;