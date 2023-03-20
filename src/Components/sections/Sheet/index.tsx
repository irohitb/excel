import React, { useMemo } from 'react';
import Searchbar from 'Components/elements/SheetsSearchBar';
import SheetsCell from 'Components/elements/SheetsCell';
import { createMatrix, createSearchMatrix } from 'utils/sheets/matrix';

import './style.scss';
import { Sheets } from 'utils/sheets/types';
import mexp from 'math-expression-evaluator';
import { errorToastProps } from 'utils/toast/';
import { toast } from 'react-toastify';
import { findAllOccurrences } from 'utils/strings';
export interface Props {
  rows: number;
  columnsObj: Sheets.Columns;
}

const Sheet: React.FC<Props> = ({ rows, columnsObj }) => {
  const columns = React.useMemo(() => {
    return Object.values(columnsObj).join('');
  }, [columnsObj]);

  const columnValueAsKeys = React.useMemo(() => {
    const keys: Sheets.DataMap = {};
    Object.keys(columnsObj).forEach((el) => {
      const value = columnsObj[el];
      keys[value] = el;
    });
    return keys;
  }, [columnsObj]);

  const CELL_MATRIX = useMemo(() => {
    return createMatrix({
      rows,
      columns: columnsObj,
    });
  }, [rows, columnsObj]);
  const [searcedhMatrix, setSearchedMatrix] = React.useState<
    Sheets.Matrix[][] | undefined
  >();
  const [searchString, setSearchString] = React.useState('');
  const [dataMap, setDataMap] = React.useState<Sheets.DataMap>({});
  const [matrix, setMatrix] = React.useState(CELL_MATRIX);

  // B1 expressions is A2 + A3 -> this would contains { A2: [B1],A3: [B1]}
  const [positionsUsedInExpressions, setPositionsUsedInExpressions] =
    React.useState<Sheets.ExpressionsMap>({});

  const [positionWithExpressionValue, setPositionWithExpressionValue] =
    React.useState<Sheets.DataMap>({});

  const onEditClicked = (val: Sheets.Matrix) => {
    const matrixToUse = searcedhMatrix || matrix;
    const newData = [...matrixToUse];
    newData[val.column][val.row] = { ...val };
    if (searcedhMatrix) {
      setSearchedMatrix(newData);
    } else {
      setMatrix(newData);
    }
  };

  const onSearchInputChange = (searchString: string) => {
    setSearchString(searchString);
    if (!searchString) {
      setSearchedMatrix(undefined);
      return;
    }
    const searchMatrixParams = {
      columns: columnsObj,
      dataMap,
      matrixData: matrix,
      searchString,
    };
    const newSearchedMatrix = createSearchMatrix(searchMatrixParams);
    setSearchedMatrix(newSearchedMatrix);
  };

  const findValuesFromCell = (
    expression: string,
    positionBeingEvaluated: string,
    newMatrix: Sheets.Matrix[][]
  ) => {
    const referencedPositions: Sheets.ExpressionsMap = {
      ...positionsUsedInExpressions,
    };
    let newExpression = expression;
    columns.split('').forEach((el, columnIndex) => {
      const indexes = findAllOccurrences(el, newExpression);
      indexes.forEach((index) => {
        let nextLetter = parseInt(newExpression[index + 1]);
        let word = `${newExpression[index] + nextLetter}`;

        const referencePositionKey = columnsObj[columnIndex] + (nextLetter - 1);
        if (positionBeingEvaluated === referencePositionKey) {
          const errorMessage = 'Cant reference self';
          toast.error(errorMessage, errorToastProps);
          return {
            newExpression,
            referencedPositions,
          };
        }
        if (Array.isArray(referencedPositions[referencePositionKey])) {
          const referencedPosition = referencedPositions[referencePositionKey];
          if (!referencedPosition.includes(positionBeingEvaluated)) {
            referencedPosition.push(positionBeingEvaluated);
          }
        } else {
          referencedPositions[referencePositionKey] = [positionBeingEvaluated];
        }
        if (isNaN(nextLetter)) {
          // check if next element is number
          throw new Error(`Can't compute ${word}`);
        }
        const wordValue =
          newMatrix[columnIndex][nextLetter - 1].data.toString();
        const filterWord = wordValue.startsWith('=')
          ? findValuesFromCell(
              wordValue.substring(1),
              positionBeingEvaluated,
              matrix
            ).newExpression
          : wordValue;
        newExpression = newExpression.replace(word, filterWord);
      });
    });

    return {
      newExpression,
      referencedPositions,
    };
  };

  const updateReferencedPositionData = (
    positionKey: string,
    matrix: Sheets.Matrix[][]
  ) => {
    let data = '';
    // Get wherever expresison is used
    const placesWhereReferencedIsUsed = positionsUsedInExpressions[positionKey];
    placesWhereReferencedIsUsed.forEach((position: string) => {
      const expression = positionWithExpressionValue[position];
      const valuesFromCell = findValuesFromCell(expression, position, matrix);
      try {
        const evaluateExpression = mexp.eval(valuesFromCell.newExpression);
        data = evaluateExpression;
      } catch (e) {
        data = valuesFromCell.newExpression;
      }
      const column = parseInt(columnValueAsKeys[position[0]]);
      const rowPosition = parseInt(position.substring(1));
      let dataForReferencedPosition = matrix[column][rowPosition];
      dataForReferencedPosition = {
        ...dataForReferencedPosition,
        data,
      };
      matrix[column][rowPosition] = dataForReferencedPosition;
    });
  };

  const updatePositionReferencedInKey = (
    newExp: string,
    oldExp: string,
    position: string,
    updatePosUsedInRef: Sheets.ExpressionsMap
  ) => {
    const positionInOldExp: string[] = [];
    const positionInNewExp: string[] = [];
    columns.split('').forEach((el, columnIndex) => {
      const indexesOfOld = findAllOccurrences(el, oldExp);
      const indexesOfNew = findAllOccurrences(el, newExp);
      indexesOfOld.forEach((index) => {
        let nextLetter = parseInt(oldExp[index + 1]);
        let word = `${oldExp[index] + (nextLetter - 1)}`;
        positionInOldExp.push(word);
      });
      indexesOfNew.forEach((index) => {
        let nextLetter = parseInt(newExp[index + 1]);
        let word = `${newExp[index] + (nextLetter - 1)}`;
        positionInNewExp.push(word);
      });
    });
    // Elements changed
    const elementsChanged = positionInOldExp.filter(
      (el) => !positionInNewExp.includes(el)
    );
    elementsChanged.forEach((el) => {
      const positionToUpdate = updatePosUsedInRef[el];
      if (Array.isArray(positionToUpdate)) {
        const index = positionToUpdate.indexOf(position);
        if (index > -1) {
          positionToUpdate.splice(index, 1);
        }
      }
    });
  };
  const onFocusChange = (val: Sheets.Matrix) => {
    let updatePosUsedInRef: Sheets.ExpressionsMap = {
      ...positionsUsedInExpressions,
    };
    let { data } = val;
    let dataForHashMap = data;
    const newdataMap = { ...dataMap };
    const key = columnsObj[val.column] + val.row;
    const newData = [...matrix];
    const newPositionExpressionValue = { ...positionWithExpressionValue };
    newData[val.column][val.row] = { ...val, data };

    if (updatePosUsedInRef[key]) {
      updateReferencedPositionData(key, matrix);
    }
    if (positionWithExpressionValue[key] && !data.startsWith('=')) {
      updatePositionReferencedInKey(
        '',
        positionWithExpressionValue[key],
        key,
        updatePosUsedInRef
      );
      delete newPositionExpressionValue[key];
    }

    if (data && data.startsWith('=')) {
      const expression = data.substring(1);

      if (
        positionWithExpressionValue[key] &&
        positionWithExpressionValue[key] !== expression
      ) {
        updatePositionReferencedInKey(
          positionWithExpressionValue[key],
          expression,
          key,
          updatePosUsedInRef
        );
      }
      const valuesFromCell = findValuesFromCell(expression, key, newData);
      try {
        const evaluateExpression = mexp.eval(valuesFromCell.newExpression);
        data = evaluateExpression;
      } catch (e) {
        data = valuesFromCell.newExpression;
      }
      updatePosUsedInRef = valuesFromCell.referencedPositions;
      newPositionExpressionValue[key] = expression;
    }
    if (!data) {
      delete newdataMap[key];
    } else {
      newdataMap[key] = dataForHashMap;
    }
    newData[val.column][val.row] = { ...val, data };
    setPositionWithExpressionValue(newPositionExpressionValue);
    setPositionsUsedInExpressions(updatePosUsedInRef);
    setDataMap(newdataMap);
    setMatrix(newData);
  };

  return (
    <div className="sheet-container">
      <Searchbar
        value={searchString}
        debouncing={true}
        onInputChange={onSearchInputChange}
      />
      <div className="sheet-heading in-row">
        {columns.split('').map((el) => (
          <SheetsCell
            key={el}
            value={el}
            editable={false}
            classNames="base-cell-properties cell-heading-properties cell-properties"
          />
        ))}
      </div>
      <div className="in-row w-100 sheets-content">
        {(searcedhMatrix || matrix).map((columns, index) => (
          <div key={`columns-${index}`} className="base-cell-properties">
            {columns.map((column, ind) => (
              <SheetsCell
                key={`${column.row}-${column.column}`}
                value={column.data || `${column.row}-${column.column}`}
                editable={true}
                data={column}
                classNames={`cell-properties ${
                  index === 1 ? 'cell-borders' : ''
                }`}
                onEditClicked={onEditClicked}
                onFocusChange={onFocusChange}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Sheet;
