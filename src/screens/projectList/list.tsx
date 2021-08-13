import { Project } from "types/project";
import { User } from "types/user";
import { Dropdown, Menu, Modal, Table, TableProps } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Pin } from "components/pin";
import { useDeleteProject, useEditProject } from "utils/API";
import { ButtonNoPadding } from "components/lib";
import { useProjectModal, useProjectsQueryKey } from "./util";
interface ListProp extends TableProps<Project> {
  users: User[];
  refresh?: () => void;
}
export const List = ({ users, ...props }: ListProp) => {
  const { mutate: editProject } = useEditProject(useProjectsQueryKey());

  //柯里化
  const pinProject = (id: number) => (pin: boolean) => editProject({ id, pin });

  return (
    <Table
      pagination={false}
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(value, project) {
            return (
              <Pin
                checked={project.pin}
                onCheckedChange={pinProject(project.id)}
              />
            );
          },
        },
        {
          title: "名称",
          sorter: (a, b) => a.name.localeCompare(b.name),
          render(value, project) {
            return <Link to={String(project.id)}>{project.name}</Link>;
          },
        },
        {
          title: "部门",
          dataIndex: "organization",
        },
        {
          title: "负责人",
          render(value, project) {
            return (
              <span>
                {users.find((user) => user.id === project.personId)?.name ||
                  "未知"}
              </span>
            );
          },
        },
        {
          title: "创建时间",
          render(value, project) {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format("YYYY-MM-DD")
                  : "无"}
              </span>
            );
          },
        },
        {
          render(value, project) {
            return <More project={project} />;
          },
        },
      ]}
      {...props}
    ></Table>
  );
};

const More = ({ project }: { project: Project }) => {
  const { startEdit } = useProjectModal();
  const editProject = (id: number) => () => startEdit(id);
  const { mutate: deleteProject } = useDeleteProject(useProjectsQueryKey());
  const confirmDeleteProject = (id: number) => {
    Modal.confirm({
      title: "🙃确定要删除这个项目🐴？",
      content: "点击确定以删除",
      okText: "😅确定",
      cancelText: "😶算了算了",
      onOk() {
        deleteProject({ id });
      },
    });
  };

  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key={"edit"}>
            <ButtonNoPadding onClick={editProject(project.id)} type={"link"}>
              编辑项目
            </ButtonNoPadding>
          </Menu.Item>
          <Menu.Item key={"delete"}>
            <ButtonNoPadding
              onClick={() => confirmDeleteProject(project.id)}
              type={"link"}
            >
              删除项目
            </ButtonNoPadding>
          </Menu.Item>
        </Menu>
      }
    >
      <ButtonNoPadding type={"link"}>...</ButtonNoPadding>
    </Dropdown>
  );
};
