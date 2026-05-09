"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Initial check
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          router.push("/auth/login"); // Use absolute path
        } else {
          setUser(user);
        }
      } catch (err) {
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // 2. Active Listener (Crucial for SaaS apps)
    // This updates the 'user' state instantly if the session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setUser(null);
        router.push("/auth/login");
      } else if (session?.user) {
        setUser(session.user);
      }
    });

    // 3. Cleanup to prevent memory leaks
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return { user, loading };
}