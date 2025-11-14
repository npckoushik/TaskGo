import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddEditTaskScreen from '../screens/AddEditTaskScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';

export type RootStackParamList = {
  Home: undefined;
  AddEdit: { id?: number } | undefined;
  Detail: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'TaskGo' }} />
      <Stack.Screen name="AddEdit" component={AddEditTaskScreen} options={{ title: 'Add / Edit Task' }} />
      <Stack.Screen name="Detail" component={TaskDetailScreen} options={{ title: 'Task' }} />
    </Stack.Navigator>
  );
}
