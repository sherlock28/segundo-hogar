import { createSlice } from "@reduxjs/toolkit";
import { recomm } from "services";
import { useToast } from "@chakra-ui/react";

const initialState = {
  userCreated: null,
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
};

export const recommSlice = createSlice({
  name: "recomm",
  initialState,
  reducers: {
    successUserCreated: (state, action) => {
      state.userCreated = action.payload;
      state.isFetching = false;
      state.isSuccess = true;
    },
    recommLoading: (state) => {
      if (state.isFetching === false) {
        state.isFetching = true;
      }
    },
    success: (state, action) => {
      state.isFetching = false;
      state.isSuccess = true;
    },
    failed: (state, action) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = action.payload.error;
    },
    clearState: (state, action) => {
      state.userCreated = null;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
    },
  },
});

export const {
  successUserCreated,
  recommLoading,
  success,
  failed,
  clearState,
} = recommSlice.actions;

export const createNodeAction = (data) => async (dispatch) => {
  dispatch(recommLoading());
  try {
    window.localStorage.setItem("createdIdPerson", data.id);
    await recomm.createNodeService({ user: data });
    dispatch(successUserCreated());
  } catch (err) {
    console.error(err);
    dispatch(failed(err));
  }
};

export const createRelationsAction = (data, showToast) => async (dispatch) => {
  dispatch(recommLoading());
  try {
    const idPerson = getCreatedIdPerson();
    await recomm.createRelationsService({ idPerson, relations: data });
    window.localStorage.removeItem("createdIdPerson");
    window.localStorage.removeItem("questionsValue");
    dispatch(clearState());
    showToast({
      title: "¡Registrado con éxito!",
      description: "Se han guardado tus preferencias con éxito.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  } catch (err) {
    console.error(err);
    dispatch(failed(err));
    showToast({
      title: "¡Ups! Algo salió mal.",
      description:
        "Por favor, inténtalo de nuevo más tarde o contacta a soporte.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};

function getCreatedIdPerson() {
  return window.localStorage.getItem("createdIdPerson");
}

export default recommSlice.reducer;

export const userCreatedSelector = (state) => state.userCreated;
