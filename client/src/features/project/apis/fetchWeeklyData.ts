// src/feature/project/api/fetchWeeklyData.ts
import axios from 'axios';
import config from '../../../config/config';



export const fetchDashboardData = async (startDate: string) => {
    const response = await axios.get(`${config.BASE_URL}/weekly-data?start=${startDate}`);
    return response.data;
};
