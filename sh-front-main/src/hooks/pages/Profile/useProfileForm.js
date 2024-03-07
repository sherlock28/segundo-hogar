import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useGetUser } from "hooks/pages/Profile/useGetUser";
import {
  UPDATE_GENDER,
  UPDATE_BIO,
  UPDATE_STUDENT_BY_USER_ID,
  UPDATE_STATES
} from "client/gql/mutations/updateProfileInfo/updateProfileInfo";
import { useToast } from "@chakra-ui/react";

export function useProfileForm() {
  const { user } = useGetUser();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [updateGender] = useMutation(UPDATE_GENDER);
  const [updateBio] = useMutation(UPDATE_BIO);
  const [updateStudentByUserId] = useMutation(UPDATE_STUDENT_BY_USER_ID)
  const [updateState] = useMutation(UPDATE_STATES)

  const onSubmit = async (data) => {
    console.log("data: ", data);
  
    try {
      await updateGender({
        variables: {
          userId: user.id,
          newGender: data.gender,
        },
      });
  
      await updateBio({
        variables: {
          userId: user.id,
          newBio: data.bio,
        },
      });
  
      await updateStudentByUserId({
        variables: {
          userId: user.id,
          newCareer: data.career,
          newCityId: data.city,
          newShared: data.share,
        },
      });
  
      await updateState({
        variables: {
          userId: user.id,
          newState: data.state,
        },
      });
  
      toast({
        title: "Datos actualizados.",
        description: "Los datos se han actualizado exitosamente.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al actualizar datos:", error);
  
      toast({
        title: "Error al actualizar datos.",
        description: "Algo salió mal. Por favor, intenta de nuevo.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      console.log("submit");
      console.log("id usuario: ", user.id);
    }
  };

  const onCancel = (e) => {
    e.preventDefault();
    console.log("Cancel");
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    onCancel,
    errors,
    isSubmitting,
  };
}
