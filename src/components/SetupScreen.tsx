export function SetupScreen() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-stone-800 mb-2">ViolReol</h1>
          <p className="text-stone-500 text-sm">Setup Required</p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-800 mb-4">
            Configure Supabase
          </h2>
          <p className="text-stone-600 text-sm mb-4">
            To get started, you need to set up your Supabase credentials:
          </p>

          <ol className="space-y-3 text-sm text-stone-600 mb-6">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center text-xs font-medium">
                1
              </span>
              <span>
                Create a project at{" "}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:underline"
                >
                  supabase.com
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center text-xs font-medium">
                2
              </span>
              <span>
                Copy and run the SQL from <code className="bg-stone-100 px-1.5 py-0.5 rounded text-xs">supabase-schema.sql</code> in your Supabase SQL Editor
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center text-xs font-medium">
                3
              </span>
              <span>
                Update <code className="bg-stone-100 px-1.5 py-0.5 rounded text-xs">src/lib/supabase.ts</code> with your
                project URL and anon key
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center text-xs font-medium">
                4
              </span>
              <span>Restart the app</span>
            </li>
          </ol>

          <div className="bg-stone-50 rounded-lg p-4 text-xs font-mono text-stone-600 overflow-x-auto">
            <p className="text-stone-400 mb-2">// src/lib/supabase.ts</p>
            <p>
              const SUPABASE_URL = <span className="text-amber-600">"https://xxx.supabase.co"</span>;
            </p>
            <p>
              const SUPABASE_ANON_KEY = <span className="text-amber-600">"eyJhbGc..."</span>;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

