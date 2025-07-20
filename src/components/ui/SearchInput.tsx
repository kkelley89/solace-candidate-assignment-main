import React from 'react';

// Future enhancements could include more props for customization
// such as variants (large for hero sections, compact for sidebars), etc.
interface SearchInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onChange,
  value,
  placeholder = 'Search...',
  className = '',
}) => {
  return (
    <input
      className={`search-input ${className}`}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
    />
  );
};
