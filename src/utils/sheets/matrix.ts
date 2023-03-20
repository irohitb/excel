import { Sheets } from "utils/sheets/types";
import _ from "lodash";
export const createMatrix = (
  matrix: Sheets.CreateMatrix
): Sheets.Matrix[][] => {
  const columns = matrix.columns;
  const lengthOFColumns = Object.keys(columns).length;
  const a = Array(lengthOFColumns)
    .fill(null)
    .map((el) => []);
  const newRows = a.map((el, indexColumns) => {
    const rowInsideColumns: Array<Sheets.Matrix> = [
      ...Array(matrix.rows)
        .fill({
          column: indexColumns,
          isEditing: false,
        })
        .map((el, index) => ({
          ...el,
          row: index,
          data: `${columns[indexColumns]}${index + 1}`,
        })),
    ];
    return rowInsideColumns;
  });

  return newRows;
};

export const createSearchMatrix = ({
  columns,
  dataMap,
  matrixData,
  searchString,
}: Sheets.CreateSaveMatrix): Sheets.Matrix[][] => {
  const lengthOFColumns = Object.keys(columns).length;
  const a: Sheets.Matrix[][] = Array(lengthOFColumns)
    .fill(null)
    .map((el) => []);
  Object.keys(dataMap).forEach((el: string) => {
    const value = `${dataMap[el]}`;
    if (value.indexOf(searchString) !== -1) {
      // Get position from matrixData using key
      const rowPosition = parseInt(el.substring(1));
      for (let i = 0; i < lengthOFColumns; i++) {
        const valueInMatrix = matrixData[i][rowPosition];
        a[i].push(valueInMatrix);
      }
    }
  });
  return a;
};
