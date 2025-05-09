import React, { useEffect } from "react";
import { Flight, FlightFormData, Country, City } from "@/types";
import Button from "@/components/Button";
import { filterFromCities, filterToCities } from "../utils/dictionaryFilters";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const flightFormSchema = z.object({
  flightNumber: z.string().min(1, "Flight number is required."),
  flightDate: z.string().min(1, "Flight date is required."),
  fromCountryId: z.number().min(1, "Origin country is required."),
  fromCityId: z.number().min(1, "Origin city is required."),
  toCountryId: z.number().min(1, "Destination country is required."),
  toCityId: z.number().min(1, "Destination city is required."),
});

type FlightFormSchema = z.infer<typeof flightFormSchema>;

interface FlightFormProps {
  initialData: Flight | null;
  countries: Country[];
  cities: City[];
  onSubmit: (data: FlightFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
}

const FlightForm: React.FC<FlightFormProps> = ({
  initialData,
  countries,
  cities,
  onSubmit,
  onCancel,
  isLoading,
  error,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FlightFormSchema>({
    resolver: zodResolver(flightFormSchema),
    defaultValues: {
      flightNumber: "",
      flightDate: "",
      fromCountryId: 0,
      fromCityId: 0,
      toCountryId: 0,
      toCityId: 0,
    },
  });

  const fromCountryId = watch("fromCountryId");
  const toCountryId = watch("toCountryId");

  useEffect(() => {
    if (initialData) {
      const formattedFlightDate = initialData.flightDate
        .replace(" ", "T")
        .substring(0, 16);
      reset({
        flightNumber: initialData.flightNumber,
        flightDate: formattedFlightDate,
        fromCountryId: initialData.fromCountryId,
        fromCityId: initialData.fromCityId,
        toCountryId: initialData.toCountryId,
        toCityId: initialData.toCityId,
      });
    } else {
      reset({
        flightNumber: "",
        flightDate: "",
        fromCountryId: 0,
        fromCityId: 0,
        toCountryId: 0,
        toCityId: 0,
      });
    }
  }, [initialData, reset]);

  const onSubmitHandler: SubmitHandler<FlightFormSchema> = (data) => {
    const flightDate = `${data.flightDate.replace("T", " ")}:00`;
    onSubmit({ ...data, flightDate });
  };

  let fromCities = filterFromCities(cities, fromCountryId);
  let toCities = filterToCities(cities, toCountryId);

  if (
    initialData?.fromCityId &&
    !fromCities.find((c) => c.cityId === initialData.fromCityId)
  ) {
    const city = cities.find((c) => c.cityId === initialData.fromCityId);
    if (city) fromCities = [city, ...fromCities];
  }

  if (
    initialData?.toCityId &&
    !toCities.find((c) => c.cityId === initialData.toCityId)
  ) {
    const city = cities.find((c) => c.cityId === initialData.toCityId);
    if (city) toCities = [city, ...toCities];
  }

  const loading = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
      {(error || Object.keys(errors).length > 0) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
          {error ||
            Object.values(errors)
              .map((e) => e?.message)
              .join(" ")}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Flight Number
        </label>
        <input
          type="text"
          {...register("flightNumber")}
          className={`mt-1 w-full border rounded-md p-2 ${
            errors.flightNumber ? "border-red-500" : "border-gray-300"
          }`}
          disabled={loading}
        />
        {errors.flightNumber && (
          <p className="mt-1 text-sm text-red-600">
            {errors.flightNumber.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Flight Date
        </label>
        <input
          type="datetime-local"
          {...register("flightDate")}
          className={`mt-1 w-full border rounded-md p-2 ${
            errors.flightDate ? "border-red-500" : "border-gray-300"
          }`}
          disabled={loading}
        />
        {errors.flightDate && (
          <p className="mt-1 text-sm text-red-600">
            {errors.flightDate.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            From Country
          </label>
          <select
            {...register("fromCountryId", { valueAsNumber: true })}
            className={`mt-1 w-full border rounded-md p-2 ${
              errors.fromCountryId ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          >
            <option value={0}>Select Country</option>
            {countries.map((c) => (
              <option key={c.countryId} value={c.countryId}>
                {c.countryName}
              </option>
            ))}
          </select>
          {errors.fromCountryId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.fromCountryId.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            From City
          </label>
          <select
            {...register("fromCityId", { valueAsNumber: true })}
            className={`mt-1 w-full border rounded-md p-2 ${
              errors.fromCityId ? "border-red-500" : "border-gray-300"
            }`}
            disabled={!fromCountryId || loading}
          >
            <option value={0}>Select City</option>
            {fromCities.map((c) => (
              <option key={c.cityId} value={c.cityId}>
                {c.cityName}
              </option>
            ))}
          </select>
          {errors.fromCityId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.fromCityId.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            To Country
          </label>
          <select
            {...register("toCountryId", { valueAsNumber: true })}
            className={`mt-1 w-full border rounded-md p-2 ${
              errors.toCountryId ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          >
            <option value={0}>Select Country</option>
            {countries.map((c) => (
              <option key={c.countryId} value={c.countryId}>
                {c.countryName}
              </option>
            ))}
          </select>
          {errors.toCountryId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.toCountryId.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            To City
          </label>
          <select
            {...register("toCityId", { valueAsNumber: true })}
            className={`mt-1 w-full border rounded-md p-2 ${
              errors.toCityId ? "border-red-500" : "border-gray-300"
            }`}
            disabled={!toCountryId || loading}
          >
            <option value={0}>Select City</option>
            {toCities.map((c) => (
              <option key={c.cityId} value={c.cityId}>
                {c.cityName}
              </option>
            ))}
          </select>
          {errors.toCityId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.toCityId.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          disabled={loading}
        >
          {loading
            ? initialData
              ? "Saving..."
              : "Registering..."
            : initialData
            ? "Save Changes"
            : "Register Flight"}
        </Button>
      </div>
    </form>
  );
};

export default FlightForm;
