import { Button, Card, Input, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useAddTask } from "utils/task";
import {
  useProjectIdInUrl,
  useTasksQueryKey,
  useTasksSearchParams,
} from "./util";

export const CreateTask = ({ kanbanId }: { kanbanId: number }) => {
  const [name, setName] = useState("");
  const { mutateAsync: addTask } = useAddTask(useTasksQueryKey());
  const projectId = useProjectIdInUrl();
  const { processorId, epicId } = useTasksSearchParams();
  const [inputMode, setInputMode] = useState(false);

  const submit = async () => {
    await addTask({ projectId, name, kanbanId, processorId, epicId });
    setInputMode(false);
    setName("");
  };

  const toggle = () => setInputMode((mode) => !mode);

  useEffect(() => {
    if (!inputMode) {
      setName("");
    }
  }, [inputMode]);
  if (!inputMode) {
    return (
      <Tooltip
        placement="topLeft"
        title="初始值为当前筛选器，类型默认为task"
        color={"cyan"}
        arrowPointAtCenter
      >
        <Button style={{ borderRadius: 6 }} type={"dashed"} onClick={toggle}>
          👉创建事务
        </Button>
      </Tooltip>
    );
  }
  return (
    <Card>
      <Input
        onBlur={toggle}
        placeholder={"需要做些什么"}
        onPressEnter={submit}
        value={name}
        onChange={(evt) => setName(evt.target.value)}
      />
    </Card>
  );
};
