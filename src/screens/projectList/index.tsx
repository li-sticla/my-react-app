import { useDebounce, useDocumentTitle } from "utils/index";
import { List } from "./list";
import { SearchPanel } from "./search-panel";
import { useProjects, useUsers } from "utils/project";
import { useProjectModal, useProjectsSearchParams } from "./util";
import {
  ButtonNoPadding,
  ErrorBox,
  Row,
  ScreenContainer,
} from "components/lib";

export const ProjectListScreen = () => {
  useDocumentTitle("项目列表", false);

  const [param, setParam] = useProjectsSearchParams();

  const debouncedParam = useDebounce(param, 2000);

  const { isLoading, error, data: list } = useProjects(debouncedParam);

  const { data: users } = useUsers();

  const { open } = useProjectModal();

  return (
    <ScreenContainer>
      <Row between={true}>
        <h1>项目列表</h1>
        <ButtonNoPadding onClick={open} type={"link"}>
          创建项目
        </ButtonNoPadding>
      </Row>

      <SearchPanel users={users || []} param={param} setParam={setParam} />
      <ErrorBox error={error} />
      <List
        loading={isLoading}
        dataSource={list || []}
        users={users || []}
      ></List>
    </ScreenContainer>
  );
};
