import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import { auth } from "./firebase.config";

export const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    console.log("Error creating auth context");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        console.log("No user subscribed");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user) {
      }
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

  const loginWithGitHub = async () => {
    const githubProvider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      if (user) {
      }
    } catch (error) {
      console.error("Error al iniciar sesión con GitHub:", error);
    }
  };

  return (
    <authContext.Provider value={{ loginWithGoogle, loginWithGitHub, user }}>
      {children}
    </authContext.Provider>
  );
}
