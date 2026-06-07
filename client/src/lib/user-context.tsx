import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiGetMe, apiLogout } from "../api/auth";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar_url?: string | null;
}

type UserMode = "user" | "admin";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAdmin: boolean;
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userMode, setUserMode] = useState<UserMode>("user");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      apiGetMe()
        .then((u) => setUser(u))
        .catch(() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }

    const handleForceLogout = () => {
      setUser(null);
      setUserMode("user");
    };
    window.addEventListener("auth:logout", handleForceLogout);
    return () => window.removeEventListener("auth:logout", handleForceLogout);
  }, []);

  const logout = async () => {
    await apiLogout();
    setUser(null);
    setUserMode("user");
  };

  const isAdmin = user?.role === "admin";

  return (
    <UserContext.Provider value={{ user, setUser, isAdmin, userMode, setUserMode, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
