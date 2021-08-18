import { QueryKey, useMutation, useQuery } from "react-query";
import { User } from "types/user";
import { cleanObject } from "utils";
import { useHttp } from "./http";
import { useAddConfig, useDeleteConfig } from "./use-optimistic-options";

export const useUsers = (param?: Partial<User>) => {
  const client = useHttp();

  return useQuery<User[]>(["users", cleanObject(param)], () =>
    client("users", { data: param })
  );
};
export const useUsersQueryKey = () => {
  return ["users", {}];
};
/**
 * 添加项目
 * @returns mutate--调用其处理请求，并乐观更新
 */
export const useAddUser = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<User>) =>
      client(`users`, {
        data: params,
        method: "POST",
      }),
    useAddConfig(queryKey)
  );
};
/**
 * 删除项目
 * @returns mutate--调用其处理请求，并乐观更新
 */
export const useDeleteUser = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`users/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
};
