import { useState } from 'react';
import axios from 'axios';

// 模拟数据
const mockResponse = {
  productLine: '产线A',
  nodes: [
    { id: '正极搅拌', label: '开始', type: 'start', x: 100, y: 100 },
    { id: '正极底涂', label: '上料', type: 'process', x: 250, y: 100 },
    { id: '陶瓷搅拌', label: '焊接', type: 'process', x: 400, y: 100 },
    { id: '底涂搅拌', label: '下料', type: 'process', x: 550, y: 100 },
    { id: '正极辊分', label: '完成', type: 'end', x: 700, y: 100 }
  ],
  edges: [
    { source: 'start', target: 'step1' },
    { source: 'step1', target: 'step2' },
    { source: 'step2', target: 'step3' },
    { source: 'step3', target: 'end' }
  ]
};

const useFlowChart = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [productLine, setProductLine] = useState('待查询');

    // 是否使用模拟数据的标志
    const useMockData = process.env.REACT_APP_USE_MOCK === 'true' || true; // 默认使用模拟数据

    const queryBarcode = async (barcode) => {
        setLoading(true);
        setError(null);
        
        if (useMockData) {
            // 使用模拟数据
            setTimeout(() => {
                setData(mockResponse);
                setProductLine(mockResponse.productLine);
                setLoading(false);
            }, 500); // 模拟网络延迟
            return;
        }
        
        try {
            const response = await axios.get(`/api/barcode?code=${barcode}`);
            setData(response.data);
            
            if (response.data && response.data.productLine) {
                setProductLine(response.data.productLine);
            }
        } catch (err) {
            setError(err.message || '查询失败');
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, productLine, queryBarcode };
};

export default useFlowChart;
