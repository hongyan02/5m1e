// API配置
export const BASE_URL = 'http://10.22.161.62:8083/api/5m1e';

export const API_CONFIG = {
  // API端点
  endpoints: {
    "productLine" : `${BASE_URL}/prod-line`, //产线代码
    "materialFeeding" : `${BASE_URL}/material-feeding`, //物料投入信息
    "inspection" : `${BASE_URL}/inspection`, //检验单记录
    "user" : `${BASE_URL}/user`, //用户信息
    "work-order" : `${BASE_URL}/work-order`, //工单信息
  }
};

// 产线代码到名称的映射
export const PROD_LINE_MAPPING = {
  'MW-601': '601线',
  'MW-602': '602线',
};