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
    "process-params" : `${BASE_URL}/process-params`, //过程参数
    "result-params" : `${BASE_URL}/result-params`, //结果参数
  }
};

// 产线编号
export const PROD_LINE_MAPPING = {
  'MW-601' : '601线',
  'MW-602' : '602线',
};
//检验类型
export const INSPECTION_TYPE = {
  'FIRST_INSPECT' : '首检',
  'PATROL_INSPECT' : '巡检',
}
//检验状态
export const INSPECTION_STATUS = {
  'COMPLETED' : '已完成',
}
//检验结果
export const RESULT_STATUS = {
  'OK' : '合格',
  'NG' : '不合格',
}
//工序名称
export const PROCESS_NAME = {
  'E010' : 'X-Ray01',
  'E020' : '极耳预焊',
  'E030' : '极耳终焊',
  'E040' : '盖板&连接片焊接前',
  'E050' : '包PET膜',
  'E060' : '入壳预焊',
  'E070' : '盖板满焊',
  'E080' : 'X-Ray02',
  'E090' : '前氦检',
  'E100' : '真空烘烤',
}
