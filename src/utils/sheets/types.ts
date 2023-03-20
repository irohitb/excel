export namespace Sheets {
  export type Status = "IN_PROGRESS" | "DONE" | "ERROR";

  export interface Columns {
    [key: number | string]: string;
  }
  export interface Matrix {
    row: number;
    column: number;
    data: string;
    isEditing: boolean;
  }
  export interface SaveDataResponse {
    id?: string;
    status: Status;
    done_at?: string;
  }
  export interface SaveDataStatus {
    status: Status;
  }
  export interface CreateMatrix {
    rows: number;
    columns: Sheets.Columns;
  }
  export interface DataMap {
    [key: string]: string;
  }

  export interface ExpressionsMap {
    [key: string]: Array<string>;
  }

  export interface CreateSaveMatrix {
    columns: Sheets.Columns;
    dataMap: DataMap;
    matrixData: Matrix[][];
    searchString: string;
  }
}
