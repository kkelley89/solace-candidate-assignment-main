"use client";

import { useEffect, useState } from "react";
import { SearchInput } from "../components/ui/SearchInput";
import { Button } from "../components/ui/Button";

// TypeScript interface for Advocate
interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  createdAt?: string;
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        console.log('fetching advocates...');
        const response = await fetch('/api/advocates');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse = await response.json();
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      } catch (error) {
        console.error('Failed to fetch advocates:', error);
        // TODO: Add user-friendly error state
      }
    };

    fetchAdvocates();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTermValue = e.target.value;
    setSearchTerm(searchTermValue);

    console.log('filtering advocates...');
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName
          .toLowerCase()
          .includes(searchTermValue.toLowerCase()) ||
        advocate.lastName
          .toLowerCase()
          .includes(searchTermValue.toLowerCase()) ||
        advocate.city.toLowerCase().includes(searchTermValue.toLowerCase()) ||
        advocate.degree.toLowerCase().includes(searchTermValue.toLowerCase()) ||
        advocate.specialties.some((specialty) =>
          specialty.toLowerCase().includes(searchTermValue.toLowerCase())
        ) ||
        advocate.yearsOfExperience.toString().includes(searchTermValue)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
    setSearchTerm("");
  };

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Solace Advocates
      </h1>

      <div className="mb-6">
        <p className="text-lg font-medium text-gray-700 mb-2">Search</p>
        <p className="text-sm text-gray-600 mb-4">
          Searching for:{' '}
          <span className="font-medium text-gray-900">{searchTerm}</span>
        </p>
        <div className="flex gap-4 items-center">
          <SearchInput
            onChange={onChange}
            value={searchTerm}
            placeholder="Search advocates..."
          />
          <Button onClick={onClick}>
            Reset Search
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">
                First Name
              </th>
              <th className="table-header">
                Last Name
              </th>
              <th className="table-header">
                City
              </th>
              <th className="table-header">
                Degree
              </th>
              <th className="table-header">
                Specialties
              </th>
              <th className="table-header">
                Years of Experience
              </th>
              <th className="table-header">
                Phone Number
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAdvocates.map((advocate) => {
              return (
                <tr key={advocate.id} className="hover:bg-gray-50">
                  <td className="table-cell font-medium">
                    {advocate.firstName}
                  </td>
                  <td className="table-cell">
                    {advocate.lastName}
                  </td>
                  <td className="table-cell">
                    {advocate.city}
                  </td>
                  <td className="table-cell">
                    {advocate.degree}
                  </td>
                  <td className="table-cell-wrap">
                    <div className="flex flex-wrap gap-1">
                      {advocate.specialties.map((s: string, index: number) => (
                        <span
                          key={index}
                          className="specialty-tag"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="table-cell">
                    {advocate.yearsOfExperience}
                  </td>
                  <td className="table-cell">
                    {advocate.phoneNumber}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
