const Filter = ({ filter, onSearchChange }) => {
  return (
    <div>
      <h1>Search</h1>
      <div>
        Filter shown with{" "}
        <input value={filter} onChange={onSearchChange}></input>
      </div>
    </div>
  );
};

export default Filter;
