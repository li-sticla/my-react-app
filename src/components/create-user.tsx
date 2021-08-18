import styled from "@emotion/styled";
import { Button, Drawer, Form, Input, Spin } from "antd";
import { ErrorBox } from "components/lib";
import { useEffect } from "react";
import access from "assets/access.svg";
import { useAddUser, useUsersQueryKey } from "utils/user";
import { useUserModal } from "./user-popover";

export const CreateUser = () => {
  const { userModalOpen, close } = useUserModal();
  const { mutate: addUser, isLoading, error } = useAddUser(useUsersQueryKey());
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    await addUser({ ...values });
    close();
  };

  useEffect(() => {
    form.resetFields();
  }, [form]);

  return (
    <Drawer
      visible={userModalOpen}
      onClose={close}
      forceRender={true}
      destroyOnClose={true}
      width={"100%"}
    >
      <Background>
        <Container>
          {isLoading ? (
            <Spin size={"large"} />
          ) : (
            <>
              <h1>新增组员</h1>
              <ErrorBox error={error} />
              <Form
                form={form}
                layout={"vertical"}
                style={{ width: "40rem" }}
                onFinish={onFinish}
              >
                <Form.Item
                  label={"名称"}
                  name={"name"}
                  rules={[{ required: true, message: "请输入组员名" }]}
                >
                  <Input placeholder={"请输入组员名称"} />
                </Form.Item>
                <Form.Item
                  label={"部门"}
                  name={"organization"}
                  rules={[{ required: true, message: "请输入部门名" }]}
                >
                  <Input placeholder={"请输入所属部门"} />
                </Form.Item>

                <Form.Item style={{ textAlign: "right" }}>
                  <Button
                    loading={isLoading}
                    type={"primary"}
                    htmlType={"submit"}
                  >
                    提交
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
        </Container>
      </Background>
    </Drawer>
  );
};

const Container = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Background = styled.div`
  width: 100%;
  height: 100%;
  background-attachment: fixed;
  background-position: left 32% bottom 60%;
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.8;
  background-image: url(${access});
`;
