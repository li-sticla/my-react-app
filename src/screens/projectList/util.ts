import { useMemo } from "react";
import { useUrlQueryParam } from "utils/url";
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
