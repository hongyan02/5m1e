// API配置
export const BASE_URL = 'http://10.22.161.62:8083/api/5m1e';

export const API_CONFIG = {
  // API端点
  endpoints: {
    "productLine" : `${BASE_URL}/prod-line`,
    "materialFeeding" : `${BASE_URL}/material-feeding`,
    "inspection" : `${BASE_URL}/inspection`,
    "user" : `${BASE_URL}/user`,
    "work-order" : `${BASE_URL}/work-order`,
  }
};

// 产线代码到名称的映射
export const PROD_LINE_MAPPING = {
  'MW-601': '601线',
  'MW-602': '602线',
};