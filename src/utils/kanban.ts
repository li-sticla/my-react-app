import { QueryKey, useMutation, useQuery } from "react-query";
import { Kanban } from "types/kanban";
import { SortProps } from "types/sort";
import { cleanObject } from "utils";
import { useHttp } from "./http";
import {
  useAddConfig,
  useDeleteConfig,
  useReorderKanbanConfig,
} from "./use-optimistic-options";

export const useKanbans = (param?: Partial<Kanban>) => {
  const client = useHttp();

  return useQuery<Kanban[]>(["kanbans", cleanObject(param)], () =>
    client("kanbans", { data: param })
  );
};
/**
 * 添加看板
 * @returns mutate--调用其处理请求，并乐观更新
 */
export const useAddKanban = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Kanban>) =>
      client(`kanbans`, {
        data: params,
        method: "POST",
      }),
    useAddConfig(queryKey)
  );
};

/**
 * 删除看板
 * @returns mutate--调用其处理请求，并乐观更新
 */
export const useDeleteKanban = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`kanbans/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
};
/**
 * 看板重新排序
 *@returns mutate--调用其处理请求，并乐观更新
 */
export const useReorderKanban = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation((params: SortProps) => {
    return client("kanbans/reorder", {
      data: params,
      method: "POST",
    });
  }, useReorderKanbanConfig(queryKey));
};
