import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Center,
  Select,
  RadioGroup,
  Stack,
  Radio,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Tooltip,
} from "@chakra-ui/react";
import { CustomButton } from "components/commons/CustomButton";
import { useSearchForm } from "hooks/pages/Search/useSearchForm";
import {
  ANY_OWNERSHIPS_TYPE,
} from "const";

export function SearchForm({ onSearch }) {
  const { onSubmitSearchPublications } = useSearchForm();

  const [ownershipsType, setOwnershipsType] = useState(null);
  const [isFurnished, setIsFurnished] = useState(false);
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [size, setSize] = useState(40);
  const [zoom, setZoom] = useState(15);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [showStartTooltip, setShowStartTooltip] = useState(false);
  const [showEndTooltip, setShowEndTooltip] = useState(false);

  const [maxDistance, setMaxDistance] = useState(5);

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const calculateZoom = (maxDistance) => {
    const baseZoom = 15;
    const distanceFactor = 1.5;
    const calculatedZoom = baseZoom - Math.log2(maxDistance) * distanceFactor;

    return Math.max(1, Math.min(20, calculatedZoom));
  };

  const handleDistanceChange = (value) => {
    setMaxDistance(value);
    const newZoom = calculateZoom(value);
    setZoom(newZoom);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "ownershipsType") {
      setOwnershipsType(value === -1 ? ANY_OWNERSHIPS_TYPE : value || null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    if (ownershipsType === null) {
      return;
    }
    const filters = {
      ownershipsType,
      isFurnished,
      bedrooms,
      bathrooms,
      size,
      priceRange,
    };
    const maxDistFilter = {
      maxDistance: maxDistance,
    };
    onSearch(maxDistFilter);
    onSubmitSearchPublications(filters);
    localStorage.setItem("maxDistance", maxDistance);
    console.log("Max Distance: ", maxDistFilter);
    console.log("filters: ", filters);
    console.log("ownership type: ", ownershipsType);
  };

  return (
    <form>
      <FormControl
        isInvalid={hasAttemptedSubmit && ownershipsType === null}
        isRequired="true"
      >
        <FormLabel>Tipo de inmueble</FormLabel>
        <Select
          onChange={handleChange}
          name="ownershipsType"
          placeholder="Selecciona el tipo de inmueble"
          _focus={{ background: "none" }}
        >
          <option>Casa</option>
          <option>Departamento</option>
          <option>Todos</option>
        </Select>
        <FormErrorMessage>
          Por favor, selecciona un tipo de inmueble
        </FormErrorMessage>
      </FormControl>

      <Flex w="100%" justifyContent="center" flexDir="column">
        <FormControl mt={8}>
          <FormLabel>Amoblado</FormLabel>
          <RadioGroup defaultValue="2">
            <Stack spacing={4} direction="row">
              <Radio value="1" onChange={() => setIsFurnished(true)}>
                Si
              </Radio>
              <Radio value="2" onChange={() => setIsFurnished(false)}>
                No
              </Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        <Stack
          shouldWrapChildren
          direction={["column", "column", "row", "row"]}
        >
          <FormControl mt={8}>
            <FormLabel>Cantidad de habitaciones</FormLabel>
            <NumberInput
              onChange={(value) => setBedrooms(value)}
              size="md"
              maxW={24}
              defaultValue={1}
              min={1}
              max={15}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl mt={8} ml={[0, 0, 4, 4]}>
            <FormLabel>Cantidad de baños</FormLabel>
            <NumberInput
              onChange={(value) => setBathrooms(value)}
              size="md"
              maxW={24}
              defaultValue={1}
              min={1}
              max={10}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </Stack>

        <FormControl mt={8}>
          <FormLabel>Tamaño (m²)</FormLabel>
          <NumberInput
            onChange={(value) => setSize(value)}
            size="md"
            maxW={24}
            defaultValue={40}
            min={0}
            max={100}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </Flex>

      <FormControl m={2}>
        <FormLabel>Precio</FormLabel>
        <RangeSlider
          aria-label={["min", "max"]}
          colorScheme="blackAlpha"
          min={0}
          max={250000}
          defaultValue={[60000, 130000]}
          onChangeEnd={(range) => setPriceRange(range)}
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
            label={priceRange[0]}
          >
            <RangeSliderThumb
              index={0}
              onMouseEnter={() => setShowStartTooltip(true)}
              onMouseLeave={() => setShowStartTooltip(false)}
            />
          </Tooltip>

          <Tooltip
            hasArrow
            bg="black"
            color="white"
            placement="top"
            isOpen={showEndTooltip}
            label={priceRange[1]}
          >
            <RangeSliderThumb
              index={1}
              onMouseEnter={() => setShowEndTooltip(true)}
              onMouseLeave={() => setShowEndTooltip(false)}
            />
          </Tooltip>
        </RangeSlider>
      </FormControl>
      <FormControl>
        <FormLabel>Distancia máxima de la facultad (KMs)</FormLabel>
        <NumberInput
          defaultValue={1}
          min={0}
          max={20}
          size="md"
          maxW={24}
          onChange={(value) => handleDistanceChange(value)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <Center my={8}>
        <CustomButton
          handleClick={handleSearch}
          type="submit"
          // isLoading={isFetching}
          loadingText="Buscando"
          width="75%"
          textButton="Buscar"
        />
      </Center>
    </form>
  );
}
