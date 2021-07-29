import { useEffect, useState } from "react";
import { List } from "./list.jsx";
import { SearchPanel } from "./search-panel";

export const ProjectListScreen = () => {
  const [list, setList] = useState([]);

  const [param, setParam] = useState({
    name: "",
    personId: "",
  });
  const [users, setUsers] = useState([]);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(
      `${apiUrl}/projects?name=${param.name}&personId=${param.personId}`
    ).then(async (response) => {
      if (response.ok) {
        setList(await response.json());
      }
    });
  }, [param]);

  useEffect(() => {
    fetch(`${apiUrl}/users`).then(async (response) => {
      if (response.ok) {
        setUsers(await response.json());
      }
    });
  }, []);

  return (
    <div>
      <SearchPanel
        users={users}
        param={param}
        setParam={setParam}
      ></SearchPanel>
      <List list={list} users={users}></List>
    </div>
  );
};
