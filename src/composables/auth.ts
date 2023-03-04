import type { Ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Account } from "~/types";
import { initializeApp } from "@firebase/app";
import { signIn, signOut } from "~/apis/accounts";

export const useAuth = () => {
  const currentUser = useState<Account | null>("currentUser", () => null);

  const isLoggedIn = !!currentUser.value;
  const organization = currentUser.value?.organization;
  const token = currentUser.value?.idToken;

  const login = (state: Ref<Account | null>) => {
    return async (email: string, password: string) => {
      const config = useRuntimeConfig();
      const app = initializeApp({
        apiKey: config.identityApiKey,
        authDomain: config.public.identityAuthDomain,
      });
      const auth = getAuth(app);
      signInWithEmailAndPassword(auth, email, password)
        .then(async credential => {
          const { user } = credential;
          const idToken = await user.getIdToken();
          const account = await signIn(idToken);
          if (account) {
            const { organization, name } = account;
            state.value = { email, idToken, organization, name };
            console.log(`Login succeeded: ${ name } in ${ organization }`);
            const { redirect } = useRoute().query;
            if (redirect && typeof redirect === "string") {
              await navigateTo(redirect);
            } else {
              await navigateTo("/");
            }
          }
        })
        .catch(error => {
          console.error(error);
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
  }

  return {
    currentUser: readonly(currentUser),
    isLoggedIn,
    organization,
    token,
    setUser: setUser(currentUser),
    login: login(currentUser),
    logout: logout(currentUser),
  }
}