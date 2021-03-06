import styled from "@emotion/styled";
import { Button, Drawer, Form, Input, Spin } from "antd";
import { useForm } from "antd/lib/form/Form";
import { ErrorBox } from "components/lib";
import { UserSelect } from "components/user-select";
import { useEffect } from "react";
import { useAddProject, useEditProject } from "utils/project";
import { useProjectModal, useProjectsQueryKey } from "./util";
import access from "assets/access.svg";

export const ProjectModal = () => {
  const { projectModalOpen, close, editingProject, isLoading } =
    useProjectModal();
  const useMutateProject = editingProject ? useEditProject : useAddProject;

  const {
    mutateAsync,
    error,
    isLoading: mutateLoading,
  } = useMutateProject(useProjectsQueryKey());
  const [form] = useForm();
  const onFinish = (values: any) => {
    mutateAsync({ ...editingProject, ...values }).then(() => {
      form.resetFields();
      closeModal();
    });
  };
  const closeModal = () => {
    form.resetFields();
    close();
  };

  const title = editingProject ? "编辑项目" : "创建项目";

  useEffect(() => {
    form.setFieldsValue(editingProject);
  }, [form, editingProject]);

  return (
    <Drawer
      forceRender={true}
      onClose={closeModal}
      visible={projectModalOpen}
      width={"100%"}
    >
      <Background>
        <Container>
          {isLoading ? (
            <Spin size={"large"} />
          ) : (
            <>
              <h1>{title}</h1>
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
                  rules={[
                    {
                      required: true,
                      message: "请输入项目名称",
                    },
                  ]}
                >
                  <Input placeholder={"请输入项目名称"} />
                </Form.Item>
                <Form.Item
                  label={"部门"}
                  name={"organization"}
                  rules={[
                    {
                      required: true,
                      message: "请输入部门名称",
                    },
                  ]}
                >
                  <Input placeholder={"请输入部门名称"} />
                </Form.Item>
                <Form.Item label={"负责人"} name={"personId"}>
                  <UserSelect defaultOptionName={"负责人"} />
                </Form.Item>
                <Form.Item style={{ textAlign: "center" }}>
                  <Button
                    loading={mutateLoading}
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
  align-items: center;
  justify-content: center;
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
