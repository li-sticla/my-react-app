import { Kanban } from "types/kanban";
import { useTasks } from "utils/task";
import { useTaskTypes } from "utils/task-type";
import { useTaskModal, useTasksSearchParams } from "./util";
import taskIcon from "assets/task.svg";
import bugIcon from "assets/bug.svg";
import styled from "@emotion/styled";
import { Card } from "antd";
import { CreateTask } from "./create-task";
import { Task } from "types/task";

interface KanbanColumnProps {
  kanban: Kanban;
  allTasks?: Task[];
}

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;
  if (!name) {
    return null;
  }
  return <img src={name === "task" ? taskIcon : bugIcon} alt={"taskType"} />;
};

export const KanbanColumn = (props: KanbanColumnProps) => {
  const allTasks = props.allTasks;
  const kanban = props.kanban;
  const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id);
  const { startEdit } = useTaskModal();
  return (
    <Container>
      <h2>{kanban.name} 💡</h2>
      <TaskContainer>
        {tasks?.map((task) => (
          <ShadowCard onClick={() => startEdit(task.id)} key={task.id}>
            <div>{task.name}</div>
            <TaskTypeIcon id={task.typeId} />
          </ShadowCard>
        ))}
        <CreateTask kanbanId={kanban.id} />
      </TaskContainer>
    </Container>
  );
};

export const Container = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`;

const TaskContainer = styled.div`
  overflow: scroll;
  flex: 1;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const ShadowCard = styled(Card)`
  cursor: pointer;
  transition: all 0.7s ease-in-out;
  margin-bottom: 0.5em;
  opacity: 0.9;
  &:hover {
    background-color: #dae8f5;
    box-shadow: 6px 15px 6px -6px rgba(48, 55, 66, 0.15);
    opacity: 0.8;
  }
`;
