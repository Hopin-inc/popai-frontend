import type { Ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import { Account } from "~/types/common";
import { getLoggedInAccount, signIn, signOut } from "~/apis/accounts";
import { getMessageByLoginError } from "~/utils/messages";

export const useAuth = () => {
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
        } else {

        }
      }
    };
  };

  const login = (state: Ref<Account | null>) => {
    return (email: string, password: string) => {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then(async (credential) => {
          const { user } = credential;
          const idToken = await user.getIdToken();
          const account = await signIn(idToken);
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
          }
        })
        .catch((error) => {
          alert(getMessageByLoginError(error.code));
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
    return (user: Account | null) => state.value = user;
  };

  return {
    currentUser: readonly(currentUser),
    isLoggedIn,
    organization,
    name,
    fetchAuthState: fetchAuthState(currentUser),
    setUser: setUser(currentUser),
    login: login(currentUser),
    logout: logout(currentUser)
  };
};
