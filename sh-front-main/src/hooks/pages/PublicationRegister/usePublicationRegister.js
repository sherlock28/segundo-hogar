import { useMutation } from "@apollo/client";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { REGISTER_PUBLICATION } from "client/gql/mutations/registerPublication/registerPublication";
import { paths } from "config/paths";
import { useQuery } from "@apollo/client";
import useLocation from "wouter/use-location";
import { useInitialPublications } from "hooks/pages/Search/useInitialPublications";
import { authSelector } from "store/slices/authSlice";
import { useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";
import { GET_PUBLICATIONS_COUNT_BY_OWNERSHIP_ID } from "client/gql/queries/users";
import { Alert, AlertIcon } from "@chakra-ui/react";

export const createPublicationAction = (data) => ({
  type: "CREATE_PUBLICATION",
  payload: data,
});

export function useRegisterPublicationForm() {
  const dispatch = useDispatch();

  const [registerPublication, { loading }] = useMutation(REGISTER_PUBLICATION);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [_, setLocation] = useLocation();
  const { publications, isError, isFetching } = useInitialPublications();

  const { user } = useSelector(authSelector);
  const ownershipId = localStorage.getItem("ownershipId");

  const {
    loading: publicationsLoading,
    error: publicationsError,
    data: publicationsData,
  } = useQuery(GET_PUBLICATIONS_COUNT_BY_OWNERSHIP_ID, {
    variables: { id: ownershipId },
  });

  console.log("publicationsData: ", publicationsData);

  const toast = useToast();
  const onSubmit = async (data) => {
    try {
      console.log("price:", data.price);
      console.log("contact_name:", data.contact_name);
      console.log("contact_phone:", data.contact_phone);
      console.log("contact_email:", data.contact_email);
      const result = await registerPublication({
        variables: {
          ownerships_id: ownershipId,
          is_furnished: data.isFurnished,
          title: data.title,
          description: data.description,
          price: data.price,
          contact_name: data.fullname,
          contact_phone: data.phone,
          contact_email: data.email,
          publication_state: true,
        },
      });
      console.log(result);
      if (result.data && result.data.registerPublication) {
        dispatch(onSubmit(result.data.registerPublication));
        localStorage.removeItem(ownershipId);
        setLocation(`/cuenta/${user.id}`);
        toast({
          title: "¡Publicación registrada con éxito!",
          description: "La publicación se ha registrado correctamente.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.error("La mutación no devolvió datos válidos.");
        setLocation(`/cuenta/${user.id}`);
        toast({
          title: "Error al registrar la publicación",
          description:
            "Algo salió mal al intentar crear la publicación. Intenta más tarde o contacta a soporte.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error al registrar la publicación:", error.message);
      setLocation(`/cuenta/${user.id}`);
      toast({
        title: "Error al registrar la publicación",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting: loading,
    // errorsCaptcha,
    onSubmit,
    // onChange,
  };
}
