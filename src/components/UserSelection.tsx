import { useUserStore } from "@/stores/userStore";
import type { User } from "@/lib/supabase";

export function UserSelection() {
  const setUser = useUserStore((state) => state.setUser);

  const handleSelect = (user: User) => {
    setUser(user);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif text-stone-800 mb-2">ViolReol</h1>
          <p className="text-stone-500 text-sm">Your shared book collection</p>
        </div>

        <p className="text-center text-stone-600 mb-8">Who's reading today?</p>

        <div className="flex gap-6 justify-center">
          <button
            onClick={() => handleSelect("August")}
            className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-3xl">
              🌻
            </div>
            <span className="text-lg font-medium text-stone-700 group-hover:text-amber-700">
              August
            </span>
          </button>

          <button
            onClick={() => handleSelect("Viola")}
            className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-violet-300 transition-all duration-200"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center text-3xl">
              🌸
            </div>
            <span className="text-lg font-medium text-stone-700 group-hover:text-violet-700">
              Viola
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

