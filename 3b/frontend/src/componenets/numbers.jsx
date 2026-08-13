const Numbers = ({ filteredPersons, onDeletePerson }) => {
  return (
    <div>
      <h1>Numbers</h1>
      <ul>
        {filteredPersons.map((person) => {
          return (
            <li key={person.id}>
              {person.name} {person.number}{" "}
              <button
                onClick={() => {
                  onDeletePerson(person.id);
                }}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Numbers;
