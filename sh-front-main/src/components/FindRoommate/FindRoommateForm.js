import React, { useState } from "react";
import {
  Box,
  Flex,
  FormErrorMessage,
  FormControl,
  FormLabel,
  Select,
  Center,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useQuery } from "@apollo/client";
import { CustomButton } from "components/commons/CustomButton";
import { useGetCities } from "hooks/utils/useGetCities";
import { useGetStates } from "hooks/utils/useGetStates";
import { useGetCareers } from "hooks/utils/useGetCareers";
import { useFindRoommateFormValidation } from "hooks/pages/FindRoomates/useFindRoommateFormValidation";
import { differenceInYears } from "date-fns";
import { GET_STUDENTS } from "client/gql/queries/utils";
import { StudentsCards } from "./StudentsCards";

export function FindRoommateForm() {
  const [ageRange, setAgeRange] = useState([18, 40]);
  const [showStartTooltip, setShowStartTooltip] = useState(true);
  const [showEndTooltip, setShowEndTooltip] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const [showStudentsCards, setShowStudentsCards] = useState(false);
  const [filters, setFilters] = useState({});
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedCareer, setSelectedCareer] = useState("");
  const [selectedState, setSelectedState] = useState(null);
  const [parsedSelectedState, setParsedSelectedState] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const [parsedSelectedCity, setParsedSelectedCity] = useState(null);

  const { loading, error, data: students } = useQuery(GET_STUDENTS);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const searchSubmit = async (filters) => {
    filters.ageRange = ageRange;
    filters.gender = selectedGender;
    filters.career = selectedCareer;
    filters.state = selectedState;
    filters.birth_date = selectedAge;
    filters.city = selectedCity;
    const parsedSelectedState = parseInt(selectedState);
    setParsedSelectedState(parsedSelectedState);
    const parsedSelectedCity = parseInt(selectedCity);

    setParsedSelectedCity(parsedSelectedCity);

    console.log("filtros", filters);
    console.log("estudiantes: ", students);

    const studentGender = students.sh_students.map(
      (student) => student?.person?.gender
    );
    const studentCareers = students.sh_students.map(
      (student) => student?.career?.name
    );
    const studentStates = students.sh_students.map(
      (student) => student?.city?.state?.id
    );
    const studentBirthDates = students.sh_students.map(
      (student) => new Date(student?.person?.birth_date)
    );
    const studentCity = students.sh_students.map(
      (student) => student?.city?.id
    );

    const genderMatch = studentGender.includes(selectedGender);
    const careerMatch = studentCareers.includes(selectedCareer);
    const statesMatch = studentStates.includes(parsedSelectedState);
    const cityMatch = studentCity.includes(parsedSelectedCity);
    const ageMatch = studentBirthDates.every((birthDate) => {
      const age = differenceInYears(new Date(), birthDate);
      return age >= ageRange[0] && age <= ageRange[1];
    });

    const allMatches = genderMatch && careerMatch && statesMatch && cityMatch;

    console.log("all matches", allMatches);
    console.log("gender match", genderMatch);
    console.log("career match", careerMatch);
    console.log("states match", statesMatch);
    console.log("city match", cityMatch);

    console.log("students cities", studentCity);
    console.log("student city filter", parsedSelectedCity);
    console.log("tipe city id", typeof studentCity);
    console.log("tipe city filter", typeof parsedSelectedCity);

    setFilters(filters);
    setShowStudentsCards(allMatches);
    setNoResults(!allMatches);
    setHasAttemptedSubmit(true);
    if (!selectedGender) {
      return;
    }
  };

  const { states } = useGetStates();
  const { cities, setStateSelected } = useGetCities();
  const { careers } = useGetCareers();

  const selectState = (stateId) => {
    setSelectedState(stateId);
    setStateSelected(stateId);
  };

  return (
    <Box textAlign="left">
      <form>
        <FormControl m={2} isInvalid={hasAttemptedSubmit && !selectedGender}>
          <FormLabel>Genero</FormLabel>
          <Select
            name="gender"
            placeholder="Selecciona..."
            width={["100%", "100%", "98%", "98%", "98%"]}
            {...register("gender")}
            onChange={(e) => setSelectedGender(e.target.value)}
            _focus={{ background: "none" }}
          >
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
            <option value="other">Otro</option>
          </Select>
          <FormErrorMessage>
            {errors.gender && errors.gender.message} Selecciona un género
            para realizar la búsqueda
          </FormErrorMessage>
        </FormControl>

        <Flex direction={["column", "column", "row", "row", "row"]}>
          <FormControl m={2} isInvalid={errors.career}>
            <FormLabel>Carrera</FormLabel>
            <Select
              name="career"
              placeholder="Selecciona..."
              {...register("career")}
              onChange={(e) => setSelectedCareer(e.target.value)}
              _focus={{ background: "none" }}
            >
              {careers?.map((career) => {
                return (
                  <option key={career.id} value={career.name}>
                    {career.name}
                  </option>
                );
              })}
            </Select>
            <FormErrorMessage>
              {errors.career && errors.career.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl m={2}>
            <FormLabel>Edad</FormLabel>
            <RangeSlider
              aria-label={["min", "max"]}
              colorScheme="blackAlpha"
              defaultValue={[18, 30]}
              onChangeEnd={(range) => {
                setAgeRange(range);
                setSelectedAge(range);
              }}
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <Tooltip
                hasArrow
                bg="black"
                color="white"
                placement="top"
                isOpen={showStartTooltip}
                label={ageRange[0]}
              >
                <RangeSliderThumb
                  index={0}
                  onMouseEnter={() => setShowStartTooltip(true)}
                  onMouseLeave={() => setShowStartTooltip(true)}
                />
              </Tooltip>

              <Tooltip
                hasArrow
                bg="black"
                color="white"
                placement="top"
                isOpen={showEndTooltip}
                label={ageRange[1]}
              >
                <RangeSliderThumb
                  index={1}
                  onMouseEnter={() => setShowEndTooltip(true)}
                  onMouseLeave={() => setShowEndTooltip(true)}
                />
              </Tooltip>
            </RangeSlider>
          </FormControl>
        </Flex>

        <Flex direction={["column", "column", "row", "row", "row"]}>
          <FormControl m={2} isInvalid={errors.state}>
            <FormLabel>Provincia</FormLabel>
            <Select
              name="state"
              placeholder="Selecciona..."
              {...register("state")}
              _focus={{ background: "none" }}
              onChange={(e) => selectState(e.target.value)}
            >
              {states?.map((state) => {
                return (
                  <option value={state.id} key={state.id}>
                    {state.name}
                  </option>
                );
              })}
            </Select>
            <FormErrorMessage>
              {errors.state && errors.state.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl m={2} isInvalid={errors.city}>
            <FormLabel>Ciudad</FormLabel>
            <Select
              name="city"
              placeholder="Selecciona..."
              {...register("city")}
              onChange={(e) => setSelectedCity(e.target.value)}
              _focus={{ background: "none" }}
            >
              {cities?.map((city) => {
                return (
                  <option value={city.id} key={city.id}>
                    {city.name}
                  </option>
                );
              })}
            </Select>
            <FormErrorMessage>
              {errors.city && errors.city.message}
            </FormErrorMessage>
          </FormControl>
        </Flex>

        <Center m={8}>
          <CustomButton
            handleClick={handleSubmit(() => searchSubmit(filters))}
            type="submit"
            // isLoading={isSubmitting}
            loadingText="Buscando..."
            width={{ base: "100%", md: "20%" }}
            textButton="Buscar"
          />
        </Center>
      </form>
      {showStudentsCards && !noResults ? (
        <StudentsCards
          filters={filters}
          students={students.sh_students}
          parsedSelectedState={parsedSelectedState}
          parsedSelectedCity={parsedSelectedCity}
        />
      ) : (
        noResults && (
          <Center>
            <Text fontSize={"25px"} py={2} as={"em"} color={"gray"}>
              No se encontraron coincidencias de búsqueda.
            </Text>
          </Center>
        )
      )}
    </Box>
  );
}
