import styled from "@emotion/styled";
import { ButtonNoPadding, Row } from "components/lib";
import { useAuth } from "context/auth-context";
import { ReactComponent as SoftwareLogo } from "assets/software-logo.svg";
import React from "react";
import { Avatar, Button, Dropdown, Menu } from "antd";
import { resetRoute } from "utils";
import { Navigate, Route, Routes } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { ProjectModal } from "screens/projectList/project-modal";
import { ProjectPopover } from "components/project-popover";
import cloud from "assets/cloud.svg";
import dayjs from "dayjs";
import { keyframes } from "@emotion/react";
import { UserPopover } from "components/user-popover";
import { CreateUser } from "components/create-user";
const ProjectScreen = React.lazy(() => import("screens/project"));
const ProjectListScreen = React.lazy(() => import("screens/projectList"));

const getTime = () => {
  const hour = dayjs().get("hour");
  return hour > 0 && hour <= 10
    ? { text: "πζ©δΈε₯½", mainColor: "#FFCC99", subColor: "#FFFFFF" }
    : hour > 10 && hour <= 13
    ? { text: "πδΈ­εε₯½", mainColor: "#FF6600", subColor: "#FFFFCC" }
    : hour > 13 && hour <= 17
    ? { text: "βδΈεε₯½", mainColor: "#66CCCC", subColor: "#CCFF99" }
    : { text: "πζδΈε₯½", mainColor: "#6666CC", subColor: "#FF9999" };
};
const now = getTime();

const AuthenticatedApp = () => {
  return (
    <Container>
      <Router>
        <PageHeader />
        <Background>
          <Main>
            <Routes>
              <Route path={"/projects"} element={<ProjectListScreen />} />
              <Route
                path={"/projects/:projectId/*"}
                element={<ProjectScreen />}
              />
              <Navigate to={"/projects"} />
            </Routes>
          </Main>
        </Background>
        <ProjectModal />
      </Router>
    </Container>
  );
};

const PageHeader = () => {
  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        <ButtonNoPadding type={"link"} onClick={resetRoute}>
          <SoftwareLogo width={"18rem"} color={"rgb(38, 132, 255)"} />
        </ButtonNoPadding>
        <ProjectPopover />
        <UserPopover />
        <CreateUser />
      </HeaderLeft>
      <HeaderRight>
        <User />
      </HeaderRight>
    </Header>
  );
};

const User = () => {
  const { logout, user } = useAuth();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ color: `${now.mainColor}` }}>{now.text}~</span>
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key={"logout"}>
              <Button type={"link"} onClick={logout}>
                η»εΊ
              </Button>
            </Menu.Item>
          </Menu>
        }
      >
        <div>
          <Button type={"link"} onClick={(e) => e.preventDefault()}>
            <SpinAvatar
              style={{
                backgroundColor: `${now.mainColor}`,
                color: `${now.subColor}`,
              }}
              size={"large"}
            >
              {user?.name}
            </SpinAvatar>
          </Button>
        </div>
      </Dropdown>
    </div>
  );
};

const Background = styled.div`
  width: 100%;
  height: calc(100vh - 6rem);
  display: flex;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  background-image: url(${cloud});
`;

const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr;
  height: 100vh;
`;

const Header = styled(Row)`
  padding: 2.2rem;
  box-shadow: 0 0 5px 0 rgba(7, 7, 7, 0.2);
  z-index: 1;
`;

const HeaderLeft = styled(Row)``;

const HeaderRight = styled.div``;

const Main = styled.main`
  width: 100%;
  display: flex;
  overflow: hidden;
  opacity: 0.85;
`;

const rotate = keyframes`
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(360deg);
  }
`;

const SpinAvatar = styled(Avatar)`
  background-color: #3ba5ec;
  color: #eaeeec;
  &:hover {
    animation: ${rotate} 1s linear;
  }
`;

export default AuthenticatedApp;
