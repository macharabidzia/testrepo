// features/flights/components/FlightsTable.tsx

import React from "react";
import { Flight } from "@/types";
import Button from "@/components/Button";

interface FlightsTableProps {
  flights: Flight[];
  onEdit: (flight: Flight) => void;
  onDelete: (flightId: number) => void;
  isDeleting?: boolean;
}

const FlightsTable: React.FC<FlightsTableProps> = ({
  flights,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  if (!flights || flights.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No flights found.</div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Flight Number
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Flight Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              From
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              To
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Input Date
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {flights.map((flight) => (
            <tr key={flight.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {flight.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {flight.flightNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {flight.flightDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {flight.fromCityDictionaryKey?.split(".").pop()},{" "}
                {flight.fromCountryDictionaryKey?.split(".").pop()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {flight.toCityDictionaryKey?.split(".").pop()},{" "}
                {flight.toCountryDictionaryKey?.split(".").pop()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {flight.inpDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {flight.actions.includes("edit") && (
                  <Button
                    onClick={() => onEdit(flight)}
                    variant="secondary"
                    size="sm"
                    className="mr-2"
                  >
                    Edit
                  </Button>
                )}
                {flight.actions.includes("delete") && (
                  <Button
                    onClick={() => onDelete(flight.id)}
                    variant="danger"
                    size="sm"
                    disabled={isDeleting}
                    isLoading={isDeleting}
                  >
                    Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlightsTable;
