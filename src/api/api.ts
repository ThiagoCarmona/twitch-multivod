import axios from 'axios';

const api = axios.create({
  baseURL: "http://18.119.120.73"
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