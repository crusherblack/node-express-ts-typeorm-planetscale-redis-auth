import axios from "axios";

const BASE_URL = process.env.EXTERNAL_API;

type GetPositionsParams = {
  description?: string;
  location?: string;
  page?: number;
  full_time?: string;
};
// CreateUser service
export const getAllPositions = async (params: GetPositionsParams) => {
  return await axios.get(BASE_URL + "/recruitment/positions.json", {
    params,
  });
};

// Find User by Id
export const getSinglePosition = async (id: string) => {
  return await axios.get(BASE_URL + "/recruitment/positions/" + id);
};
