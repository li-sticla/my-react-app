import { useMemo } from "react";
import { useProject } from "utils/API";
import { useSetUrlSearchParam, useUrlQueryParam } from "utils/url";
/**
 * 项目列表搜索参数
 * @returns [param, setParam]
 */
export const useProjectsSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  return [
    useMemo(
      () => ({
        ...param,
        personId: Number(param.personId) || undefined,
      }),
      [param]
    ),
    setParam,
  ] as const;
};
/**
 * 根据当前 url 获取 query 缓存键值
 * @returns ["projects", params];
 */
export const useProjectsQueryKey = () => {
  const [params] = useProjectsSearchParams();
  return ["projects", params];
};
/**
 * 获取项目模态框状态
 */
export const useProjectModal = () => {
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    "projectCreate",
  ]);
  const [{ editingProjectId }, setEditingProjectId] = useUrlQueryParam([
    "editingProjectId",
  ]);
  const { data: editingProject, isLoading } = useProject(
    Number(editingProjectId)
  );
  const setUrlParams = useSetUrlSearchParam();

  const open = () => setProjectCreate({ projectCreate: true });
  const close = () => setUrlParams({ projectCreate: "", editingProjectId: "" });
  const startEdit = (id: number) =>
    setEditingProjectId({ editingProjectId: id });
  return {
    projectModalOpen: projectCreate === "true" || Boolean(editingProjectId),
    open,
    close,
    startEdit,
    editingProject,
    isLoading,
  };
};
