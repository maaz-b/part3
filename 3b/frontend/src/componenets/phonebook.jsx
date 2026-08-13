const Phonebook = ({ onSubmit, onNameChange, onPhoneChange, name, phone }) => {
  return (
    <div>
      <h1>Phonebook</h1>
      <form onSubmit={onSubmit}>
        <div>
          Name: <input value={name} onChange={onNameChange}></input>
        </div>
        <div>
          Number: <input value={phone} onChange={onPhoneChange}></input>
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default Phonebook;
