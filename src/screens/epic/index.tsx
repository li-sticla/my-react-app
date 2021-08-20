import styled from "@emotion/styled";
import { Button, Card, List, Modal } from "antd";
import { Row, ScreenContainer } from "components/lib";
import dayjs from "dayjs";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useProjectInUrl } from "screens/kanban/util";
import { Epic } from "types/epic";
import { useDeleteEpic, useEpics } from "utils/epic";
import { useTasks } from "utils/task";
import { CreateEpic } from "./create-epic";
import { useEpicsQueryKey } from "./util";

export const EpicScreen = () => {
  const { data: currentProject } = useProjectInUrl();
  const { data: epics } = useEpics({ projectId: currentProject?.id });
  const { data: tasks } = useTasks({ projectId: currentProject?.id });

  const { mutate: deleteEpic } = useDeleteEpic(useEpicsQueryKey());
  const [epicCreateOpen, setEpicCreateOpen] = useState(false);

  const confirmDeleteEpic = (epic: Epic) => {
    Modal.confirm({
      title: "🙃你确定要删除这个任务组🐴？",
      content: "😡别怪我没提醒你",
      okText: "😶确定",
      cancelText: "😅算了算了",
      onOk() {
        deleteEpic({ id: epic.id });
      },
    });
  };
  return (
    <ScreenContainer>
      <Row gap={5} marginBottom={3}>
        <h1>{currentProject?.name}任务组</h1>
        <Button
          style={{ borderRadius: "10px", opacity: "0.9" }}
          type={"primary"}
          onClick={() => setEpicCreateOpen(true)}
        >
          创建任务组
        </Button>
      </Row>
      <List
        grid={{ gutter: 50, column: 4 }}
        dataSource={epics}
        itemLayout={"vertical"}
        renderItem={(epic) => (
          <List.Item>
            <ShadowCard style={{ minWidth: "250px" }}>
              <List.Item.Meta
                title={
                  <Row between={true}>
                    <span>{epic.name}</span>
                    <Button
                      style={{
                        backgroundColor: "#2fcff7",
                        color: "white",
                        opacity: "0.8",
                      }}
                      onClick={() => confirmDeleteEpic(epic)}
                      type={"ghost"}
                    >
                      删除
                    </Button>
                  </Row>
                }
                description={
                  <div>
                    <div>
                      开始时间：{dayjs(epic.start).format("YYYY-MM-DD")}
                    </div>
                    <div>结束时间：{dayjs(epic.end).format("YYYY-MM-DD")}</div>
                  </div>
                }
                avatar={"🗃️"}
              />
              <div>
                任务：
                {tasks
                  ?.filter((task) => task.epicId === epic.id)
                  .map((task) => (
                    <Link
                      style={{ display: "flex" }}
                      to={`/projects/${currentProject?.id}/kanban?editingTaskId=${task.id}`}
                      key={task.id}
                    >
                      {`📝 ${task.name}`}
                    </Link>
                  ))}
              </div>
            </ShadowCard>
          </List.Item>
        )}
      />
      <CreateEpic
        onClose={() => setEpicCreateOpen(false)}
        visible={epicCreateOpen}
      />
    </ScreenContainer>
  );
};

const ShadowCard = styled(Card)`
  border-radius: 5px;
  margin-bottom: 0.5em;
  transition: all 0.5s ease-in-out;
  &:hover {
    color: #6d43e2;
    background-color: #bcc7fc;
    transform: scale(1.02);
    box-shadow: inset -4px -4px 10px rgba(164, 237, 240, 0.5),
      inset 4px 4px 10px rgba(4, 196, 221, 0.1);
  }
`;
