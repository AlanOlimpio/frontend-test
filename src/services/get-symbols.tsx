import { api } from "@/lib/axios";

export const getSymbols = async () => {
  const response = await api.get("/exchangeInfo");
  return response.data.symbols;
};
