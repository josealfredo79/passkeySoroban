import { createContext } from "react";

export const RegistrationContext = createContext<{
  triggerRegister: (username?: string) => void;
} | null>(null);
