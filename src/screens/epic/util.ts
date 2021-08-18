import { useProjectIdInUrl } from "screens/kanban/util";

export const useEpicsSearchParams = () => ({
  projectId: useProjectIdInUrl(),
});

export const useEpicsQueryKey = () => ["epics", useEpicsSearchParams()];
