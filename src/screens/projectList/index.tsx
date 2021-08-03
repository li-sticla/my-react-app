import { useEffect, useState } from "react";
import { cleanObject, useDebounce, useMount } from "utils/index";
import { List } from "./list";
import { SearchPanel } from "./search-panel";
import { useHttp } from "utils/http";

export interface Project {
  name: string;
  id: string;
  personId: string;
  organization: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  title: string;
  organization: string;
  token: string;
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

  const client = useHttp();

  useEffect(() => {
    client("projects", { data: cleanObject(debouncedParam) }).then(setList);
  }, [debouncedParam]);

  useMount(() => {
    client("users").then(setUsers);
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
