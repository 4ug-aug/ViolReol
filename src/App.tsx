import { Layout } from "@/components/Layout";
import { SetupScreen } from "@/components/SetupScreen";
import { UserSelection } from "@/components/UserSelection";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useUserStore } from "@/stores/userStore";

function App() {
  const user = useUserStore((state) => state.user);

  if (!isSupabaseConfigured) {
    return <SetupScreen />;
  }

  if (!user) {
    return <UserSelection />;
  }

  return <Layout />;
}

export default App;
