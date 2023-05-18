import type { Ref } from "vue";
import {
  getAuth,
  OAuthProvider,
  signInWithPopup,
} from "@firebase/auth";
import { Account } from "~/types/common";
import { getLoggedInAccount, signIn, signOut } from "~/apis/auth";
import { getMessageByAuthError } from "~/utils/messages";
import { ChatToolId } from "~/consts/enum";
import { ReadonlyRef } from "~/types/utils";

type ProviderId = "oidc.slack";
interface UseAuth {
  currentUser: ReadonlyRef<Account | null>;
  isLoggedIn: boolean;
  organization: string | undefined;
  name: string | undefined;
  fetchAuthState: () => Promise<void>;
  setUser: (user: Account | null) => void;
  login: (providerId: ProviderId, scopes?: string[], initial?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): UseAuth => {
  const currentUser = useState<Account | null>("currentUser", () => null);

  const isLoggedIn = !!currentUser.value;
  const organization = currentUser.value?.organization;
  const name = currentUser.value?.name;

  const fetchAuthState = (state: Ref<Account | null>) => {
    return async () => {
      if (!state.value) {
        const account = await getLoggedInAccount();
        if (account) {
          const { organization, name } = account;
          state.value = { organization, name };
        }
      }
    };
  };

  const login = (state: Ref<Account | null>) => {
    return async (providerId: ProviderId, scopes: string[] = [], initial: boolean = false) => {
      const { startLoading, finishLoading } = useLoading();
      const chatToolId = providerId === "oidc.slack" ? ChatToolId.SLACK : null;
      const provider = new OAuthProvider(providerId);
      scopes.forEach(scope => provider.addScope(scope));
      const auth = getAuth();
      await signInWithPopup(auth, provider)
        .then(async (credential) => {
          startLoading();
          const { user } = credential;
          const idToken = await user.getIdToken();
          const account = await signIn(idToken);
          finishLoading();
          if (account) {
            const { organization, name } = account;
            state.value = { organization, name };
            const { redirect } = useRoute().query;
            if (redirect && typeof redirect === "string") {
              await navigateTo(redirect);
            } else {
              await navigateTo("/");
            }
            await useInfo().fetchAll();
          } else if (initial && chatToolId) {
            await navigateTo({ path: "/install", query: { chatToolId } });
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
      await signOut();
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
    organization,
    name,
    fetchAuthState: fetchAuthState(currentUser),
    setUser: setUser(currentUser),
    login: login(currentUser),
    logout: logout(currentUser),
  };
};
