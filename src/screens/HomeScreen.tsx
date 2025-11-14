import React, { useEffect } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loadTasks, Task } from '../features/tasks/tasksSlice';
import { RootState } from '../app/store';
import TaskCard from '../components/TaskCard';
import { FAB, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { list, loading } = useSelector((s: RootState) => s.tasks);

  useEffect(() => { dispatch(loadTasks() as any); }, [dispatch]);

  return (
    <View style={{flex:1, padding:12}}>
      <FlatList
        data={list}
        keyExtractor={(item: Task) => String(item.id)}
        renderItem={({item}) => (
          <TaskCard task={item} onPress={() => navigation.navigate('Detail' as any, { id: item.id })} />
        )}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => dispatch(loadTasks() as any)} />}
      />
      <FAB icon="plus" onPress={() => navigation.navigate('AddEdit' as any)} style={{position:'absolute', right:16, bottom:16}} />
    </View>
  );
}
