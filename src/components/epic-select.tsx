import { useEpicsSearchParams } from "screens/epic/util";
import { useEpics } from "utils/epic";
import { IdSelect } from "./id-select";

export const EpicSelect = (props: React.ComponentProps<typeof IdSelect>) => {
  const { data: epics } = useEpics(useEpicsSearchParams());
  return <IdSelect options={epics || []} {...props}></IdSelect>;
};
