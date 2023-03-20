import axios from "axios";
import { Sheets } from "utils/sheets/types";

axios.defaults.baseURL = "http://localhost:8082";
axios.defaults.headers.post["Content-Type"] = "application/json";

export const postRequest = async (
  csvData: Sheets.Matrix[][]
): Promise<Sheets.SaveDataResponse> => {
  const { data } = await axios.post("/save", csvData);
  return data;
};

export const getStatusOfRequest = async (
  id: string
): Promise<Sheets.SaveDataStatus> => {
  const { data } = await axios.get("/get-status", {
    params: {
      id,
    },
  });
  return data;
};
