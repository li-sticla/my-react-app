import { AppProviders } from "context";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ProjectListScreen from "screens/projectList";
import fakeData from "./db.json";

const apiUrl = process.env.REACT_APP_API_URL;

const server = setupServer(
  rest.get(`${apiUrl}/me`, (req, res, ctx) => {
    res(ctx.json({ id: 1, name: "jack", token: "123" }));
  }),
  rest.get(`${apiUrl}/users`, (req, res, ctx) => {
    res(ctx.json(fakeData.users));
  }),
  rest.get(`${apiUrl}/projects`, (req, res, ctx) => {
    const { name = "", personId = undefined } = Object.fromEntries(
      req.url.searchParams
    );
    //简易查询
    const result = fakeData?.projects?.filter((project) => {
      return (
        project.name.includes(name) &&
        (personId ? project.personId === +personId : true)
      );
    });
    return res(ctx.json(result));
  })
);

beforeAll(() => server.listen());
//每一个测试跑完后，重置mock路由
afterEach(() => server.resetHandlers());
//所有样例测试完后，关闭mock路由
afterAll(() => server.close());

const renderScreen = (ui: ReactNode, { route = "/projects?name=" } = {}) => {
  window.history.pushState({}, "Test Page", route);
  return render(<AppProviders>{ui}</AppProviders>);
};
//等待异步渲染结果，出现'骑手管理'意味等待结束
const waitTable = () =>
  waitFor(() => expect(screen.getByText("骑手管理")).toBeInTheDocument(), {
    timeout: 3000,
  });

test("项目列表展示正常", async () => {
  renderScreen(<ProjectListScreen />, { route: "/projects" });
  await waitTable();
  expect(screen.getAllByRole("row").length).toBe(fakeData.projects.length + 1);
});
test("搜索项目正常", async () => {
  renderScreen(<ProjectListScreen />, {
    route: "/projects?personId=1&name=骑手",
  });
  await waitTable();
  expect(screen.getAllByRole("row").length).toBe(2);
  expect(screen.getByText("骑手管理")).toBeInTheDocument();
});
