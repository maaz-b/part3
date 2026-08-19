import axios from "axios";

const baseUrl = "/api/persons";

const getAll = () => {
  const req = axios.get(baseUrl);
  return req.then((response) => {
    return response.data;
  });
};

const createPerson = (newPerson) => {
  const req = axios.post(baseUrl, newPerson);
  return req.then((response) => {
    return response.data;
  });
};

const editPerson = (id, newPerson) => {
  const req = axios.put(baseUrl + "/" + id, newPerson);
  return req.then((response) => {
    return response.data;
  });
};

const deletePerson = (id) => {
  const req = axios.delete(baseUrl + "/" + id);
  return req.then((response) => {
    return response.data;
  });
};

export default { getAll, createPerson, editPerson, deletePerson };
