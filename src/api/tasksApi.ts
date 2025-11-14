import axios from 'axios';
// const API = axios.create({ baseURL: 'http://localhost:3000' }); // change to machine IP for physical device
const API = axios.create({ baseURL: 'http://192.168.0.188:3000' });

export const fetchTasksApi = () => API.get('/tasks');
export const createTaskApi = (task: any) => API.post('/tasks', task);
export const updateTaskApi = (id: number, changes: any) => API.patch(`/tasks/${id}`, changes);
export const deleteTaskApi = (id: number) => API.delete(`/tasks/${id}`);
