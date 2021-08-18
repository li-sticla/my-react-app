import styled from "@emotion/styled";
import { Popover, Typography, List, Divider, Button, Modal } from "antd";
import { User } from "types/user";
import { useSetUrlSearchParam, useUrlQueryParam } from "utils/url";
import { useDeleteUser, useUsers, useUsersQueryKey } from "utils/user";
import { ButtonNoPadding } from "./lib";

export const useUserModal = () => {
  const [{ userCreate }, setUserCreate] = useUrlQueryParam(["userCreate"]);

  const setUrlParams = useSetUrlSearchParam();

  const open = () => setUserCreate({ userCreate: true });
  const close = () => setUrlParams({ userCreate: "" });

  return {
    userModalOpen: userCreate === "true",
    open,
    close,
  };
};

export const UserPopover = () => {
  const { data: users } = useUsers();
  const { open } = useUserModal();

  const { mutate: deleteUser } = useDeleteUser(useUsersQueryKey());
  const confirmDeleteUser = (user: User) => {
    Modal.confirm({
      title: "🙃你确定要删除这个组员🐴？",
      content: "😡别怪我没提醒你",
      okText: "😶确定",
      cancelText: "😅算了算了",
      onOk() {
        deleteUser({ id: user.id });
      },
    });
  };

  const content = (
    <ContentContainer>
      <Typography.Text type={"secondary"}>组员列表</Typography.Text>
      <List>
        {users?.map((user) => (
          <List.Item key={user.id}>
            <List.Item.Meta title={user.name} />
            <List.Item.Meta title={user.organization} />
            <Button onClick={() => confirmDeleteUser(user)}>删除</Button>
          </List.Item>
        ))}
      </List>
      <Divider />
      <ButtonNoPadding onClick={open} type={"link"}>
        添加组员
      </ButtonNoPadding>
    </ContentContainer>
  );

  return (
    <Popover placement={"bottom"} content={content}>
      <span style={{ cursor: "pointer" }}>组员</span>
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 30rem;
`;
