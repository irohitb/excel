import React from "react";
import { Sheets } from "utils/sheets/types";
import Penicl from "assets/svg/pencil.svg";
import "./style.scss";
interface BaseProps {
  value: string;
  classNames?: string;
}

type MainProps =
  | (BaseProps & {
      editable: true;
      data: Sheets.Matrix;
      onEditClicked: (val: Sheets.Matrix) => void;
      onFocusChange: (data: Sheets.Matrix) => void;
    })
  | (BaseProps & {
      editable: false;
      data?: undefined;
      onEditClicked?: undefined;
      onFocusChange?: undefined;
    });

const SheetsCell: React.FC<MainProps> = ({
  editable,
  value,
  classNames = "",
  data,
  onEditClicked,
  onFocusChange,
}) => {
  const [inputValue, setInputValue] = React.useState(value);
  const [focus, setFocus] = React.useState(false);

  const onInputFocusLost = () => {
    if (data) {
      onFocusChange({
        ...data,
        data: inputValue,
        isEditing: false,
      });
      setFocus(false);
    }
  };

  const onEditButtonClicked = () => {
    if (data) {
      onEditClicked({ ...data, isEditing: true });
      setFocus(true);
    }
  };
  const showCellContent = () => {
    const isEditing = data?.isEditing || false;
    if (!editable) return <p className="para">{value}</p>;
    if (editable && !isEditing) {
      return (
        <div className="w-100 flex">
          <p className="para text-center w-100">{value}</p>
          <img className="pencil" src={Penicl} onClick={onEditButtonClicked} />
        </div>
      );
    }
    if (editable && isEditing) {
      return (
        <input
          autoFocus={focus}
          className="w-100"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={onInputFocusLost}
        />
      );
    }
    return <p className="para">{inputValue}</p>;
  };

  return (
    <div className={`${classNames} center-everything sheet-cell-container`}>
      {showCellContent()}
    </div>
  );
};

export default SheetsCell;
