import axios from 'axios';
import https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: false
});

const api = axios.create({
  baseURL: "https://thiagocarmona.xyz",
  httpsAgent: agent
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