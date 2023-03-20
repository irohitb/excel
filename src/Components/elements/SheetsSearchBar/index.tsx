import React from "react";
import "./style.scss";
import SearchSvg from "assets/svg/search.svg";
import useDebounce from "utils/useDebounce";

export interface Props {
  value: string;
  onInputChange: (val: string) => void;
  debouncing: boolean;
}

const Searchbar: React.FC<Props> = ({
  value = "",
  onInputChange,
  debouncing = true,
}) => {
  const [inputValue, setInputValue] = React.useState(value);
  const debouncedValue = useDebounce<string>(inputValue, 500);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (!debouncing) {
      onInputChange(event.target.value);
    }
  };
  React.useEffect(() => {
    if (debouncing) {
      onInputChange(inputValue);
    }
  }, [debouncedValue]);
  return (
    <div className="search-container">
      <img src={SearchSvg} />
      <input
        type="text"
        className="search-bar"
        placeholder={"Type a search query to filter"}
        onChange={onChange}
        value={inputValue || value}
      />
    </div>
  );
};

export default Searchbar;
