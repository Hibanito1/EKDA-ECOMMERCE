import { Redirect } from "expo-router";

export default function Index() {
  // In production, check auth state and redirect accordingly
  return <Redirect href="/(auth)/welcome" />;
}
