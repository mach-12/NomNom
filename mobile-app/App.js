import { View, Text } from 'react-native';
import AppNavigation from './Components/appNavigation';
import { LogBox } from "react-native"

LogBox.ignoreAllLogs()

export default function App() {
  return (
    <AppNavigation/>
  );
}
