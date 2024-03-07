import { useState } from "react";

export function useFindRoommateFormValidation() {
  const [errors, setErrors] = useState({
    gender: "",
    career: "",
    state: "",
    city: "",
  });

  const validateForm = (filters) => {
    const newErrors = {
      gender: validateGender(filters.gender),
      career: validateCareer(filters.career),
      state: validateState(filters.state),
      city: validateCity(filters.city),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== "");
  };

  const validateGender = (gender) => {
    // Implement your gender validation logic here
    // Return an empty string for no error or a custom error message
    return "";
  };

  const validateCareer = (career) => {
    // Implement your career validation logic here
    // Return an empty string for no error or a custom error message
    return "";
  };

  const validateState = (state) => {
    // Implement your state validation logic here
    // Return an empty string for no error or a custom error message
    return "";
  };

  const validateCity = (city) => {
    // Implement your city validation logic here
    // Return an empty string for no error or a custom error message
    return "";
  };

  return {
    errors,
    validateForm,
  };
}