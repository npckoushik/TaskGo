import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Card, Checkbox } from 'react-native-paper';
import { Task } from '../features/tasks/tasksSlice';
import { useDispatch } from 'react-redux';
import { updateTask } from '../features/tasks/tasksSlice';

export default function TaskCard({ task, onPress }: { task: Task, onPress: () => void }) {
  const dispatch = useDispatch();
  const toggle = () => {
    dispatch(updateTask({ id: task.id, changes: { status: task.status === 'todo' ? 'done' : 'todo' } }) as any);
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={{marginBottom:10}}>
        <Card.Content>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <View>
              <Text style={{fontWeight:'600'}}>{task.title}</Text>
              {task.notes ? <Text style={{color:'#666'}} numberOfLines={2}>{task.notes}</Text> : null}
            </View>
            <Checkbox status={task.status === 'done' ? 'checked' : 'unchecked'} onPress={toggle} />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}
