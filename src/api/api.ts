import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getSyncVods = async (vodId: string, channels: string[], minutes?: number) => {
  try{
    const response = await api.post(`/sync/${vodId}`, {
      channels,
      vodMinutes: minutes || 0,
    });
    return response.data;
  } catch(err) {
    console.log(err);
    return null;
  }
};

export const getVodInfo = async (vodId: string) => {
  try{
    const response = await api.get(`/vod/${vodId}`);
    return response.data;
  } catch(err) {
    throw err;
  }
};