import { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "user" | "admin";
type UserMode = "user" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAdmin: boolean;
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userMode, setUserMode] = useState<UserMode>("user");

  const isAdmin = user?.role === "admin";

  return (
    <UserContext.Provider value={{ user, setUser, isAdmin, userMode, setUserMode }}>
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
