import React, { useState, useEffect } from 'react';
import { View, TextInput } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask } from '../features/tasks/tasksSlice';
import { RootState } from '../app/store';

export default function AddEditTaskScreen({ route, navigation }: any) {
  const id = route?.params?.id;
  const dispatch = useDispatch();
  const existing = useSelector((s: RootState) => s.tasks.list.find(t => t.id === id));
  const [title, setTitle] = useState(existing?.title ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');

  useEffect(()=> {
    if(existing) { setTitle(existing.title); setNotes(existing.notes ?? ''); }
  }, [existing]);

  const save = () => {
    if (!title.trim()) return alert('Title required');
    if (existing) {
      dispatch(updateTask({ id: existing.id, changes: { title, notes } }) as any);
    } else {
      dispatch(addTask({ title, notes, status: 'todo' }) as any);
    }
    navigation.goBack();
  };

  return (
    <View style={{padding:12}}>
      <TextInput value={title} onChangeText={setTitle} placeholder="Title" style={{borderWidth:1,borderColor:'#ddd',padding:8,marginBottom:10}} />
      <TextInput value={notes} onChangeText={setNotes} placeholder="Notes" style={{borderWidth:1,borderColor:'#ddd',padding:8,marginBottom:10, height:100}} multiline />
      <Button mode="contained" onPress={save}>{existing ? 'Update' : 'Add'} Task</Button>
    </View>
  );
}
