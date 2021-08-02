import { useEffect, useState } from "react";
import { cleanObject, useDebounce, useMount } from "utils/index";
import { List } from "./list";
import { SearchPanel } from "./search-panel";
import * as qs from "qs";
export interface Project {
  name: string;
  id: string;
  personId: string;
}
export interface User {
  name: string;
  id: string;
}
export const ProjectListScreen = () => {
  const [list, setList] = useState([]);

  const [param, setParam] = useState({
    name: "",
    personId: "",
  });
  const [users, setUsers] = useState([]);

  const apiUrl = process.env.REACT_APP_API_URL;

  const debouncedParam = useDebounce(param, 2000);

  useEffect(() => {
    fetch(
      `${apiUrl}/projects?${qs.stringify(cleanObject(debouncedParam))}`
    ).then(async (response) => {
      if (response.ok) {
        setList(await response.json());
      }
    });
  }, [debouncedParam]);

  useMount(() => {
    fetch(`${apiUrl}/users`).then(async (response) => {
      if (response.ok) {
        setUsers(await response.json());
      }
    });
  });

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
