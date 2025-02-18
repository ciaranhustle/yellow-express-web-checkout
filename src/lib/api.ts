import axios from "axios";

export const api = async (
  url: string,
  { method = "GET", data = {} }: ApiOptions = {}
) => {
  try {
    const response = await axios({
      url,
      method,
      data,
    });

    return response;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("AxiosError:", err.message);
      return err.response;
    } else {
      console.error("Unexpected Error:", err);
    }
  }
};
