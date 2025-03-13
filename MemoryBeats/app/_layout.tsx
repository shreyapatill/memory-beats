import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#1DB954",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ title: "Memory Music" }} 
        />
        <Stack.Screen 
          name="songs" 
          options={{ title: "Childhood Songs" }} 
        />
      </Stack>
    </PaperProvider>
  );
}