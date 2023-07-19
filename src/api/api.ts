import axios from 'axios';

const api = axios.create({
  baseURL: "https://thiagocarmona.xyz",
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