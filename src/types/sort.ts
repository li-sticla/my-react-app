export interface SortProps {
  //要重新排序的item
  fromId: number;
  //参照目标item
  referenceId: number;
  //放在目标item的前或后
  type: "before" | "after";
  fromKanbanId?: number;
  toKanbanId?: number;
}
