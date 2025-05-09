// api/auth.ts

import { LoginForm, LoginResponse } from "@/types";
import { fetchFormDataApi } from "./apiClient";

export const login = async (credentials: LoginForm): Promise<LoginResponse> => {
  const formData = new FormData();
  formData.append("userName", credentials.userName);
  formData.append("password", credentials.password);
  formData.append("channel", credentials.channel);

  const response = await fetchFormDataApi("/admin/login", formData);
  return response as LoginResponse;
};
