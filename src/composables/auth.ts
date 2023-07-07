import type { Ref } from "vue";
import * as firebaseAuth from "@firebase/auth";
import { Account } from "~/types/common";
import { getLoggedInAccount, signIn, signOut } from "~/apis/auth";
import { getMessageByAuthError } from "~/utils/messages";
import { ChatToolId } from "~/consts/enum";
import { ReadonlyRef } from "~/types/utils";

type ProviderId = "oidc.slack";
interface UseAuth {
  currentUser: ReadonlyRef<Account | null>;
  isLoggedIn: boolean;
  isRegistered: boolean;
  name: string | undefined;
  fetchAuthState: () => Promise<void>;
  setUser: (user: Account | null) => void;
  login: (providerId: ProviderId, scopes?: string[], initial?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): UseAuth => {
  const currentUser = useState<Account | null>("currentUser", () => null);

  const isLoggedIn = !!currentUser.value;
  const isRegistered = currentUser.value?.isRegistered ?? false;
  const name = currentUser.value?.name;

  const fetchAuthState = (state: Ref<Account | null>) => {
    return async () => {
      if (!state.value) {
        const account = await getLoggedInAccount();
        if (account) {
          const { name, isRegistered } = account;
          state.value = { name, isRegistered };
        }
      }
    };
  };

  const login = (state: Ref<Account | null>) => {
    return async (providerId: ProviderId, scopes: string[] = [], initial: boolean = false) => {
      const chatToolId = providerId === "oidc.slack" ? ChatToolId.SLACK : null;
      const provider = new firebaseAuth.OAuthProvider(providerId);
      scopes.forEach(scope => provider.addScope(scope));
      const auth = firebaseAuth.getAuth();
      await firebaseAuth.signInWithPopup(auth, provider)
        .then(async (credential) => {
          const { user } = credential;
          const idToken = await user.getIdToken();
          const account = await signIn(idToken);
          const { isRegistered, name } = account ?? {};
          if (isRegistered === true) {
            if (!name) {
              await navigateTo("create-account");
            }
            state.value = { isRegistered, name: name ?? "" };
            const { redirect } = useRoute().query;
            if (redirect && typeof redirect === "string") {
              await navigateTo(redirect);
            } else {
              await navigateTo("/");
            }
            await useInfo().fetchAll();
          } else if (chatToolId && (initial || isRegistered === false)) {
            await navigateTo({ path: "/install", query: { chatToolId } });
          } else {
            alert("ログインに失敗しました。");
          }
        })
        .catch((error) => {
          if (!["auth/popup-closed-by-user", "auth/user-cancelled"].includes(error.code)) {
            alert(getMessageByAuthError(error.code));
          }
        });
    };
  };

  const logout = (state: Ref<Account | null>) => {
    return async () => {
      const auth = firebaseAuth.getAuth();
      await Promise.all([
        signOut(),
        firebaseAuth.signOut(auth),
      ]);
      state.value = null;
      await navigateTo("/login");
    };
  };

  const setUser = (state: Ref<Account | null>) => {
    return (user: Account | null) => {
      state.value = user;
    };
  };

  return {
    currentUser: readonly(currentUser),
    isLoggedIn,
    isRegistered,
    name,
    fetchAuthState: fetchAuthState(currentUser),
    setUser: setUser(currentUser),
    login: login(currentUser),
    logout: logout(currentUser),
  };
};
