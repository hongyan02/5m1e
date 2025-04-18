import axios from 'axios';
import { BASE_URL, API_CONFIG } from '../config/apiConfig';

// 创建axios实例，可以设置基础URL和默认配置
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 产线信息API
export const fetchProductLine = async (materialLotCode) => {
  try {
    const response = await apiClient.post(API_CONFIG.endpoints.productLine, {
      material_lot_code: materialLotCode
    });
    return response.data;
  } catch (error) {
    console.error('获取产线信息失败:', error);
    throw error;
  }
};

// 流程图数据API
export const fetchFlowChartData = async (materialLotCode) => {
  try {
    // 这里可以替换为实际的流程图数据API
    const response = await apiClient.get(`${API_CONFIG.endpoints.flowChart}?code=${materialLotCode}`);
    return response.data;
  } catch (error) {
    console.error('获取流程图数据失败:', error);
    throw error;
  }
};

// 物料上料信息API
export const fetchMaterialFeeding = async (materialLotCode, operationName) => {
  try {
    const response = await apiClient.post(API_CONFIG.endpoints.materialFeeding, {
      material_lot_code: materialLotCode,
      operation_name: operationName
    });
    return response.data;
  } catch (error) {
    console.error('获取物料上料信息失败:', error);
    throw error;
  }
};

// 移除不需要的API
// export const fetchMachineInfo = async (materialLotCode) => {
//   // 实现机器信息API
// };

// export const fetchMaterialInfo = async (materialLotCode) => {
//   // 实现物料信息API
// };