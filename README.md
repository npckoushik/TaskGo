# TaskGo 📋

A mobile-first, offline-first task manager built with React Native (Expo) and TypeScript.

## 🚀 About

TaskGo is an Android mobile application designed to help users manage tasks seamlessly—even when offline.  
It uses local storage for persistence and connects to a mock REST API for syncing when network is available.

## 🔧 Key Features

- Add, edit and delete tasks  
- Mark tasks as done / to-do  
- Tasks persist locally using `AsyncStorage`  
- Sync with a JSON-server backend when online  
- Simple, clean UI built with React Native & React Native Paper  
- Navigation flows with React Navigation  
- State management via Redux Toolkit  
- TypeScript for type safety and maintainability  

## 🧰 Tech Stack

- **Frontend**: React Native (Expo) + TypeScript  
- **State Management**: Redux Toolkit  
- **Storage**: `@react-native-async-storage/async-storage` for offline persistence  
- **Backend (Mock)**: `json-server` for REST API during development  
- **UI Library**: react-native-paper  
- **Tools**: Git, GitHub, Expo CLI  

## 📁 Project Structure

```text
taskgo/
├─ App.tsx
├─ db.json                 ← mock backend data
├─ src/
│  ├─ api/
│  │    └─ tasksApi.ts     ← API wrapper
│  ├─ app/
│  │    └─ store.ts        ← Redux store
│  ├─ features/
│  │    └─ tasks/
│  │          ├─ tasksSlice.ts
│  │          └─ tasksThunks.ts
│  ├─ utils/
│  │    ├─ storage.ts      ← local storage helpers
│  │    └─ syncQueue.ts    ← queued-delete logic
│  ├─ navigation/
│  │    └─ index.tsx       ← main app navigator
│  ├─ screens/
│  │    ├─ HomeScreen.tsx
│  │    ├─ AddEditTaskScreen.tsx
│  │    └─ TaskDetailScreen.tsx
│  └─ components/
│       └─ TaskCard.tsx     ← task list card component
└─ README.md
