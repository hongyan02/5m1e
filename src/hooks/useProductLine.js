import { useState } from 'react';
import { fetchProductLine } from '../services/api';
import { PROD_LINE_MAPPING } from '../config/apiConfig';

const useProductLine = () => {
  const [productLine, setProductLine] = useState('待查询');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 将产线代码映射为产线名称
  const mapProductLine = (code) => {
    return PROD_LINE_MAPPING[code] || code; // 如果没有映射，则返回原始代码
  };

  const queryProductLine = async (materialLotCode) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchProductLine(materialLotCode);
      if (response && response.prod_line_code) {
        // 使用映射将产线代码转换为产线名称
        setProductLine(mapProductLine(response.prod_line_code));
      } else {
        setProductLine('未知产线');
      }
    } catch (err) {
      setError('获取产线信息失败');
      setProductLine('查询失败');
    } finally {
      setLoading(false);
    }
  };

  return { productLine, loading, error, queryProductLine };
};

export default useProductLine;