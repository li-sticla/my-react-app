import { Button, Form, Input, Modal, Spin } from "antd";
import { useForm } from "antd/lib/form/Form";
import { TaskTypeSelect } from "components/task-type-select";
import { UserSelect } from "components/user-select";
import { useEffect } from "react";
import { useDeleteTask, useEditTask } from "utils/task";
import { useTaskModal, useTasksQueryKey } from "./util";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export const TaskModal = () => {
  const [form] = useForm();
  const {
    editingTaskId,
    editingTask,
    close,
    isLoading: taskLoading,
  } = useTaskModal();
  const { mutateAsync: editTask, isLoading: editLoading } = useEditTask(
    useTasksQueryKey()
  );

  const onCancel = () => {
    close();
    form.resetFields();
  };
  const onOk = async () => {
    await editTask({ ...editingTask, ...form.getFieldsValue() });
    close();
  };

  const { mutateAsync: deleteTask } = useDeleteTask(useTasksQueryKey());
  const confirmDeleteTask = () => {
    Modal.confirm({
      title: "🙃你确定要删除这个任务🐴？",
      content: "😡别怪我没提醒你",
      okText: "😶确定",
      cancelText: "😅算了算了",
      async onOk() {
        await deleteTask({ id: Number(editingTaskId) });
        close();
      },
    });
  };

  useEffect(() => {
    form.setFieldsValue(editingTask);
  }, [form, editingTask]);

  return (
    <Modal
      forceRender={true}
      onCancel={onCancel}
      onOk={onOk}
      okText={"确认"}
      cancelText={"取消"}
      confirmLoading={editLoading}
      title={"编辑任务"}
      visible={!!editingTaskId}
    >
      {taskLoading ? (
        <Spin size={"large"} />
      ) : (
        <div>
          <Form {...layout} initialValues={editingTask} form={form}>
            <Form.Item
              label={"任务名"}
              name={"name"}
              rules={[{ required: true, message: "请输入任务名" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label={"经办人"} name={"processorId"}>
              <UserSelect defaultOptionName={"经办人"} />
            </Form.Item>
            <Form.Item label={"类型"} name={"typeId"}>
              <TaskTypeSelect />
            </Form.Item>
          </Form>
          <div style={{ textAlign: "right" }}>
            <Button
              onClick={confirmDeleteTask}
              type={"primary"}
              style={{ fontSize: "14px" }}
              size={"small"}
            >
              删除
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
