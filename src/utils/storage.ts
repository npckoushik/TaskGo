import AsyncStorage from '@react-native-async-storage/async-storage';
const TASKS_KEY = 'taskgo_tasks';

export const saveLocalTasks = async (tasks: any[]) => {
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const loadLocalTasks = async () => {
  const s = await AsyncStorage.getItem(TASKS_KEY);
  return s ? JSON.parse(s) : [];
};
