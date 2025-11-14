import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// CHANGE THIS TO YOUR PC IP
const API = axios.create({ baseURL: 'http://192.168.0.188:3000' });

const QUEUE_KEY = 'taskgo_queue';

type QueueItem = {
  op: 'delete';
  id: number;
};

export async function enqueueDelete(id: number) {
  const s = await AsyncStorage.getItem(QUEUE_KEY);
  const arr: QueueItem[] = s ? JSON.parse(s) : [];
  arr.push({ op: 'delete', id });
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(arr));
}

export async function flushQueue() {
  const s = await AsyncStorage.getItem(QUEUE_KEY);
  const arr: QueueItem[] = s ? JSON.parse(s) : [];

  if (arr.length === 0) return;

  const remaining: QueueItem[] = [];

  for (const item of arr) {
    try {
      if (item.op === 'delete') {
        await API.delete(`/tasks/${item.id}`);
      }
    } catch (err) {
      remaining.push(item);
    }
  }

  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
}
