import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Project } from "types/project";
import { User } from "types/user";
import { cleanObject } from "utils";
import { useHttp } from "./http";
import { useAsync } from "./use-async";

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  return useQuery<Project[]>(["projects", param], () =>
    client("projects", { data: cleanObject(param || {}) })
  );
};

export const useUsers = (param?: Partial<User>) => {
  const { run, ...result } = useAsync<User[]>();
  const client = useHttp();
  useEffect(() => {
    run(client("users", { data: cleanObject(param || {}) }));
  }, [param, run, client]);
  return result;
};
/**
 * 编辑项目
 * @returns mutate--调用其处理请求，并刷新缓存数据
 */
export const useEditProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        data: params,
        method: "PATCH",
      }),
    { onSuccess: () => queryClient.invalidateQueries("projects") }
  );
};
/**
 * 添加项目
 * @returns mutate--调用其处理请求，useAsync各项数据
 */
export const useAddProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        data: params,
        method: "POST",
      }),
    { onSuccess: () => queryClient.invalidateQueries("projects") }
  );
};
/**
 * 获取项目详情
 * @param id
 */
export const useProject = (id?: number) => {
  const client = useHttp();
  return useQuery<Project>(
    ["project", { id }],
    () => client(`projects/${id}`),
    {
      enabled: Boolean(id),
    }
  );
};
