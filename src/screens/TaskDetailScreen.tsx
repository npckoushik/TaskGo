import React from 'react';
import { View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { removeTask } from '../features/tasks/tasksSlice';
import { Button } from 'react-native-paper';

export default function TaskDetailScreen({ route, navigation }: any) {
  const id = route.params.id;
  const task = useSelector((s: RootState) => s.tasks.list.find(t => t.id === id));
  const dispatch = useDispatch();

  if (!task) return <View style={{padding:12}}><Text>Task not found</Text></View>;

  const del = () => {
    dispatch(removeTask(task.id) as any);
    navigation.goBack();
  };

  return (
    <View style={{padding:12}}>
      <Text style={{fontSize:20, fontWeight:'700'}}>{task.title}</Text>
      {task.notes ? <Text style={{marginTop:10}}>{task.notes}</Text> : null}
      <View style={{marginTop:20}}>
        <Button mode="contained" onPress={del}>Delete Task</Button>
      </View>
    </View>
  );
}
