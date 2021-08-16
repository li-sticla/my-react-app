import { Form, Input, Spin } from "antd";
import { useForm } from "antd/lib/form/Form";
import Modal from "antd/lib/modal/Modal";
import { TaskTypeSelect } from "components/task-type-select";
import { UserSelect } from "components/user-select";
import { useEffect } from "react";
import { useEditTask } from "utils/task";
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
      )}
    </Modal>
  );
};
