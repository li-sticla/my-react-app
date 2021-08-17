import { Kanban } from "types/kanban";
import { useTaskTypes } from "utils/task-type";
import { useKanbansQueryKey, useTaskModal, useTasksSearchParams } from "./util";
import taskIcon from "assets/task.svg";
import bugIcon from "assets/bug.svg";
import styled from "@emotion/styled";
import { Button, Card, Dropdown, Menu, Modal } from "antd";
import { CreateTask } from "./create-task";
import { Task } from "types/task";
import { Mark } from "components/mark";
import { useDeleteKanban } from "utils/kanban";
import { Row } from "components/lib";
import React from "react";
import { Drag, Drop } from "components/drag-and-drop";

interface KanbanColumnProps {
  kanban: Kanban;
  allTasks: Task[] | undefined;
}

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;
  if (!name) {
    return null;
  }
  return <img src={name === "task" ? taskIcon : bugIcon} alt={"taskType"} />;
};

const TaskCard = ({ task }: { task: Task }) => {
  const { startEdit } = useTaskModal();
  const { name: keyword } = useTasksSearchParams();

  return (
    <ShadowCard onClick={() => startEdit(task.id)} key={task.id}>
      <Mark name={task.name} keyword={keyword} />
      <div style={{ fontFamily: "Tahoma" }}>
        type: <TaskTypeIcon id={task.typeId} />
      </div>
    </ShadowCard>
  );
};

const More = ({ kanban }: { kanban: Kanban }) => {
  const { mutate: deleteKanban } = useDeleteKanban(useKanbansQueryKey());
  const confirmDeleteKanban = () => {
    Modal.confirm({
      title: "🙃你确定要删除这个看板🐴？",
      content: "😡别怪我没提醒你",
      okText: "😶确定",
      cancelText: "😅算了算了",
      onOk() {
        deleteKanban({ id: kanban.id });
      },
    });
  };
  const overlay = (
    <Menu>
      <Menu.Item>
        <Button type={"link"} onClick={confirmDeleteKanban}>
          删除
        </Button>
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={overlay}>
      <Button type={"link"}>...</Button>
    </Dropdown>
  );
};

export const KanbanColumn = React.forwardRef<HTMLDivElement, KanbanColumnProps>(
  ({ kanban, allTasks, ...props }, ref) => {
    const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id);

    return (
      <Container ref={ref} {...props}>
        <Row between={true}>
          <h2>{kanban.name} 💡</h2>
          <More kanban={kanban} key={kanban.id} />
        </Row>
        <Drop
          type={"ROW"}
          direction={"vertical"}
          droppableId={String(kanban.id)}
        >
          <TaskContainer>
            {tasks?.map((task, index) => (
              <Drag key={task.id} index={index} draggableId={"task" + task.id}>
                <div ref={ref}>
                  <TaskCard task={task} key={task.id} />
                </div>
              </Drag>
            ))}
            <CreateTask kanbanId={kanban.id} />
          </TaskContainer>
        </Drop>
      </Container>
    );
  }
);

export const Container = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
  transition: all 0.5s ease-in-out;
  &:hover {
    background-color: #caf2f5;
    transform: scale(0.98);
    box-shadow: inset -4px -4px 10px rgba(255, 255, 255, 0.5),
      inset 4px 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const TaskContainer = styled.div`
  min-height: 5px;
  overflow: scroll;
  flex: 1;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const ShadowCard = styled(Card)`
  cursor: pointer;
  border-radius: 10px;
  margin-bottom: 0.5em;
  transition: all 0.8s linear;
  &:hover {
    color: #2acfdb;
    transform: scale(0.97);
    box-shadow: inset -4px -4px 10px rgba(164, 237, 240, 0.5),
      inset 4px 4px 10px rgba(4, 196, 221, 0.1);
  }
`;
