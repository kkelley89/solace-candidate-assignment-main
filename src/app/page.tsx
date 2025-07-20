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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false
  });

  useEffect(() => {
    const fetchAdvocates = async (searchQuery = '') => {
      try {
        setLoading(true);
        setError(null);
        console.log('fetching advocates...');
        
        // Build API URL with search params
        const params = new URLSearchParams();
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        params.append('page', pagination.page.toString());
        params.append('limit', pagination.limit.toString());
        
        const response = await fetch(`/api/advocates?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse = await response.json();
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
        setPagination(jsonResponse.pagination);
      } catch (error) {
        console.error('Failed to fetch advocates:', error);
        setError('Failed to load advocates. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvocates();
  }, [pagination.page]); // Only refetch when page changes

  // Debounced search function for server-side search
  const debouncedSearch = async (searchQuery: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      params.append('page', '1'); // Reset to first page on search
      params.append('limit', pagination.limit.toString());
      
      const response = await fetch(`/api/advocates?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonResponse = await response.json();
      setAdvocates(jsonResponse.data);
      setFilteredAdvocates(jsonResponse.data);
      setPagination(jsonResponse.pagination);
    } catch (error) {
      console.error('Failed to search advocates:', error);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTermValue = e.target.value;
    setSearchTerm(searchTermValue);
    // Debouncing will be handled by useEffect below
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]); // Trigger when searchTerm changes

  const onClick = () => {
    setSearchTerm("");
    debouncedSearch(""); // Clear search on server
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
          {loading && <span className="ml-2 text-blue-500">Searching...</span>}
        </p>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="flex gap-4 items-center">
          <SearchInput
            onChange={onChange}
            value={searchTerm}
            placeholder="Search advocates..."
            disabled={loading}
          />
          <Button onClick={onClick} disabled={loading}>
            Reset Search
          </Button>
        </div>
      </div>

      {/* Results summary */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredAdvocates.length} of {pagination.total} advocates
          {pagination.totalPages > 1 && ` (Page ${pagination.page} of ${pagination.totalPages})`}
        </p>
        {loading && (
          <div className="flex items-center text-sm text-gray-500">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </div>
        )}
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
