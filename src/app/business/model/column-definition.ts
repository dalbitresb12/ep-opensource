export interface ColumnDefinition<T> {
  label: string;
  key: keyof T;
  type: "text" | "number";
  min?: number;
  max?: number;
  maxlength?: number;
  hide?: boolean;
  required?: boolean;
}
