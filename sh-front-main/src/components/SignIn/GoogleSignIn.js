import React, { useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useMutation, useApolloClient } from "@apollo/client";
import { AuthProvider } from "./AuthContextGoogle.jsx";
import { GoogleLoginButton } from "react-social-login-buttons";
import { INITIAL_REGISTER_STUDENT_USER_WITH_SOC_NET } from "client/gql/mutations/registerUser/registerStudentUserSocialNetwork.js";
import { useLocation } from "wouter";
import { paths } from "config/paths";
import { signInSocialNetAction } from "store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLoginWithSocialNet } from "hooks/pages/SignIn/useLoginWithSocialNet.js";
import { authSelector } from "store/slices/authSlice";
import { GET_USER_BY_EMAIL } from "client/gql/queries/users";
import { useToast } from "@chakra-ui/react";

const GoogleSignIn = () => {
  const toast = useToast();
  const { onSubmitLogginWithSocialNet } = useLoginWithSocialNet();
  const provider = new GoogleAuthProvider();
  const [_, setLocation] = useLocation();
  const [initialRegisterStudentUser] = useMutation(
    INITIAL_REGISTER_STUDENT_USER_WITH_SOC_NET
  );

  const dispatch = useDispatch();
  const { isAuthenticated, user_category } = useSelector(authSelector);
  const client = useApolloClient();

  const handleLoginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(getAuth(), provider);
      const user = result.user;

      const nameParts = user.displayName.split(" ");

      const firstName = nameParts[0];
      const lastName = nameParts[1];

      if (user) {
        const userData = {
          lastname: lastName || "",
          firstname: firstName || "",
          email: user.email || "",
          created_with_sn: true,
          user_status: true,
          file_number: 0,
          user_categories_id: 2,
        };

        console.log("Datos del usuario:", userData);
        console.log("Mail del usuario:", user.email);

        localStorage.setItem("userData", JSON.stringify(userData));
        console.log(user.email);

        const isEmailRegistered = await checkIfEmailRegistered(user.email);

        try {
          console.log("el user esta registrado?" + isEmailRegistered);
          if (isEmailRegistered) {
            dispatch(signInSocialNetAction(user.email));
            setLocation(paths.search);
          } else {
            const registerResult = await initialRegisterStudentUser({
              variables: userData,
            });

            dispatch(signInSocialNetAction(user.email));
            toast({
              title: "Registrado con éxito.",
              description: "El usuario se ha registrado con éxito.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            console.log("está registrando");
            setLocation(paths.completeProfile);
          }
        } catch (error) {
          console.error(
            "Error al registrar o iniciar sesión con el usuario:",
            error
          );
          toast({
            title: "Error al iniciar sesión",
            description: "Intente mas tarde",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      if (error.code === "auth/account-exists-with-different-credential") {
        const loginError =
          "Ya existe una cuenta con el mismo correo electrónico pero con diferente credencial de inicio de sesión. Intente iniciar sesión con una credencial diferente.";
        toast({
          title: "Error al iniciar sesión",
          description: loginError,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    const firebaseConfig = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    };

    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }

    return () => {
      getAuth().signOut();
    };
  }, []);

  const checkIfEmailRegistered = async (email) => {
    try {
      console.log("mail que llega:" + email);
      const { data } = await client.query({
        query: GET_USER_BY_EMAIL,
        variables: { email },
        fetchPolicy: "no-cache",
      });

      console.log(data);
      console.log("existe person? ", data?.sh_users.length > 0);
      return data?.sh_users.length > 0;
    } catch (error) {
      console.error("Error al verificar el correo electrónico:", error);
      return false;
    }
  };

  return (
    <AuthProvider>
      <GoogleLoginButton onClick={handleLoginWithGoogle} />
    </AuthProvider>
  );
};

export default GoogleSignIn;
