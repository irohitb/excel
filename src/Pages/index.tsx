import React from 'react';
import './style.scss';
import Sheets from 'Components/sections/Sheet';
import LoadingSpinner from 'Components/elements/LoadingSpinner';
import { Sheets as SheetType } from 'utils/sheets/types';
import { postRequest, getStatusOfRequest } from 'utils/sheets/request';
import { errorToastProps } from 'utils/toast/';
import { toast } from 'react-toastify';

const columns: SheetType.Columns = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E',
};

export type StatusMessage = 'loading' | 'saved' | null;

const SpreadSheetPage = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <div className="in-row">
          <h1 className="h1">Spreadsheet</h1>
        </div>
        <Sheets rows={40} columnsObj={columns} />
      </div>
    </div>
  );
};

export default SpreadSheetPage;
