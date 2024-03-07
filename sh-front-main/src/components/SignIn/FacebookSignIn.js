import React from "react";
import { AuthProvider, useAuth } from "./AuthContextGoogle";
import { FacebookLoginButton } from "react-social-login-buttons";
import { useMutation, useApolloClient } from "@apollo/client";
import {
  REGISTER_STUDENT_USER_WITH_SOC_NET,
  INITIAL_REGISTER_STUDENT_USER_WITH_SOC_NET,
} from "client/gql/mutations/registerUser/registerStudentUserSocialNetwork.js";
import { useLocation } from "wouter";
import { paths } from "config/paths";
import { signInSocialNetAction } from "store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLoginWithSocialNet } from "hooks/pages/SignIn/useLoginWithSocialNet.js";
import { authSelector } from "store/slices/authSlice";
import { USER_CATEGORIES } from "const";
import { getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { GET_STUDENT_USER_BY_ID } from "client/gql/queries/users";
import { GET_USER_BY_EMAIL } from "client/gql/queries/users";

const FacebookSignIn = () => {
  const { onSubmitLogginWithSocialNet } = useLoginWithSocialNet();
  const provider = new FacebookAuthProvider();
  const [_, setLocation] = useLocation();
  const [registerStudentUser] = useMutation(REGISTER_STUDENT_USER_WITH_SOC_NET);
  const [initialRegisterStudentUser] = useMutation(
    INITIAL_REGISTER_STUDENT_USER_WITH_SOC_NET
  );

  const dispatch = useDispatch();

  const { isAuthenticated, user_category } = useSelector(authSelector);
  const client = useApolloClient();

  const handleLoginWithGitHub = async () => {
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
            console.log("está registrando");
            setLocation(paths.completeProfile);
          }
        } catch (error) {
          console.error(
            "Error al registrar o iniciar sesión con el usuario:",
            error
          );
        }
      }
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

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
      <FacebookLoginButton onClick={handleLoginWithGitHub} />
    </AuthProvider>
  );
};

export default FacebookSignIn;
