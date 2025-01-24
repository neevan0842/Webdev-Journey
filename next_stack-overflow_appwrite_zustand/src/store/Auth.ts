import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { AppwriteException, ID, Models } from "appwrite";
import { account } from "@/models/client/config";

export interface UserPrefs {
  reputation: number;
}

interface IAuthStore {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<UserPrefs> | null;
  hydrared: boolean;

  setHydrated(): void;
  verifySession(): Promise<void>;
  login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  createAccount(
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  logout(): Promise<void>;
}

export const useAuthStore = create<IAuthStore>()(
  // persist the storage of all the things
  persist(
    // immer takes care of mutation and changing state
    immer((set) => ({
      // these are all the values and functions in store (below)
      session: null,
      jwt: null,
      user: null,
      hydrared: false,
      setHydrated: () => set({ hydrared: true }),
      verifySession: async () => {
        try {
          const session = await account.getSession("current");
          set({ session });
        } catch (error: any) {
          console.log(error);
        }
      },
      login: async (email: string, password: string) => {
        try {
          const session = await account.createEmailPasswordSession(
            email,
            password
          );
          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT(),
          ]);

          if (!user.prefs?.reputation) {
            await account.updatePrefs({ reputation: 0 });
          }

          set({ session, user, jwt });

          return { success: true };
        } catch (error: any) {
          console.log(error);
          return { success: false, error };
        }
      },
      createAccount: async (name: string, email: string, password: string) => {
        try {
          await account.create(ID.unique(), email, password, name);
          return { success: true };
        } catch (error: any) {
          console.log(error);
          return { success: false, error };
        }
      },
      logout: async () => {
        try {
          await account.deleteSessions();
          set({ session: null, jwt: null, user: null });
        } catch (error: any) {
          console.log(error);
        }
      },
    })),
    {
      name: "auth",
      onRehydrateStorage: () => {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);
