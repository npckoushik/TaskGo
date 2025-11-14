import { enqueueDelete } from '../../utils/syncQueue';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchTasksApi, createTaskApi, updateTaskApi, deleteTaskApi } from '../../api/tasksApi';
import { loadLocalTasks, saveLocalTasks } from '../../utils/storage';
import NetInfo from '@react-native-community/netinfo';
import { resolveConflict } from '../../utils/conflictResolver';

export type Task = {
  id: number;
  title: string;
  notes?: string;
  status: 'todo'|'done';
  dueDate?: string|null;
  updatedAt: string;
};

type TasksState = { list: Task[]; loading: boolean; error?: string };

const initialState: TasksState = { list: [], loading: false };

export const loadTasks = createAsyncThunk('tasks/load', async () => {
  // Attempt remote fetch; fallback to local
  const net = await NetInfo.fetch();
  const local = await loadLocalTasks();
  if (!net.isConnected) return local;

  try {
    const res = await fetchTasksApi();
    const remote = res.data as Task[];
    // simple conflict resolution
    const merged = resolveConflict(local, remote);
    await saveLocalTasks(merged);
    return merged;
  } catch {
    return local;
  }
});

export const addTask = createAsyncThunk('tasks/add', async (payload: Omit<Task, 'id' | 'updatedAt'>) => {
  const newTask: Task = {
    id: Date.now(),
    ...payload,
    updatedAt: new Date().toISOString()
  };
  const net = await NetInfo.fetch();
  if (net.isConnected) {
    try {
      const res = await createTaskApi(newTask);
      return res.data as Task;
    } catch {
      // fall through to local
    }
  }
  // local fallback
  const local = await loadLocalTasks();
  const list = [newTask, ...local];
  await saveLocalTasks(list);
  return newTask;
});

export const updateTask = createAsyncThunk('tasks/update', async ({id, changes}: {id:number, changes:any}) => {
  const updated = { ...changes, updatedAt: new Date().toISOString() };
  const net = await NetInfo.fetch();
  if (net.isConnected) {
    try {
      const res = await updateTaskApi(id, updated);
      return res.data;
    } catch {
      // fallback
    }
  }
  const local = await loadLocalTasks();
  const list = local.map((t:any)=> t.id===id ? {...t, ...updated} : t);
  await saveLocalTasks(list);
  return { id, ...updated };
});

export const removeTask = createAsyncThunk('tasks/remove', async (id: number) => {
  const net = await NetInfo.fetch();
  if (net.isConnected) {
    try {
      await deleteTaskApi(id); // existing api call
      const local = await loadLocalTasks();
      const list = local.filter((t:any) => t.id !== id);
      await saveLocalTasks(list);
      return id;
    } catch (err) {
      // network request failed even though online — enqueue for retry
      await enqueueDelete(id);
      const local = await loadLocalTasks();
      const list = local.filter((t:any) => t.id !== id);
      await saveLocalTasks(list);
      return id;
    }
  } else {
    // offline: enqueue and delete locally
    await enqueueDelete(id);
    const local = await loadLocalTasks();
    const list = local.filter((t:any) => t.id !== id);
    await saveLocalTasks(list);
    return id;
  }
});


const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setLocalList(state, action: PayloadAction<Task[]>) {
      state.list = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loadTasks.pending, s => { s.loading = true; })
      .addCase(loadTasks.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(loadTasks.rejected, (s, a) => { s.loading = false; s.error = a.error?.message; })
      .addCase(addTask.fulfilled, (s, a) => { s.list.unshift(a.payload as Task); saveLocalTasks(s.list); })
      .addCase(updateTask.fulfilled, (s, a) => {
        const idx = s.list.findIndex(t => t.id === (a.payload as any).id);
        if (idx >= 0) s.list[idx] = a.payload as Task;
        saveLocalTasks(s.list);
      })
      .addCase(removeTask.fulfilled, (s, a) => { s.list = s.list.filter(t => t.id !== a.payload); saveLocalTasks(s.list); });
  }
});

export const { setLocalList } = tasksSlice.actions;
export default tasksSlice.reducer;



// inside removeTask thunk
