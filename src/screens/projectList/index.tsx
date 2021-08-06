import { useState } from "react";
import { useDebounce } from "utils/index";
import { List } from "./list";
import { SearchPanel } from "./search-panel";
import styled from "@emotion/styled";
import { Typography } from "antd";
import { useProjects, useUsers } from "utils/API";

export interface Project {
  name: string;
  id: string;
  personId: string;
  organization: string;
  created: number;
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
  const [param, setParam] = useState({
    name: "",
    personId: "",
  });

  const debouncedParam = useDebounce(param, 2000);

  const { isLoading, error, data: list } = useProjects(debouncedParam);

  const { data: users } = useUsers();

  return (
    <Container>
      <h1>项目列表</h1>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      {error ? (
        <Typography.Text type={"danger"}>{error.message}</Typography.Text>
      ) : null}
      <List
        loading={isLoading}
        dataSource={list || []}
        users={users || []}
      ></List>
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`;
