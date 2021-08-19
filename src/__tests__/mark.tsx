import { render, screen } from "@testing-library/react";
import { Mark } from "components/mark";

test("Mark组件正确高亮关键词", () => {
  const name = "物料管理";
  const keyword = "管理";

  render(<Mark name={name} keyword={keyword} />);
  //测试组件被正确渲染
  expect(screen.getByText(keyword)).toBeInTheDocument();
  //测试组件关键词正确高亮
  expect(screen.getByText(keyword)).toHaveStyle("color:#257AFD");
  //测试组件非关键词不高亮
  expect(screen.getByText("物料")).not.toHaveStyle("color:#257AFD");
});
