import { useMutation } from "@tanstack/react-query";
import { login as apiLogin } from "@/api";
import { setToken } from "@/lib";
import { LoginForm, LoginResponse } from "@/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface UseLoginMutationProps {
  router: AppRouterInstance;
}

export function useLoginMutation({ router }: UseLoginMutationProps) {
  return useMutation<LoginResponse, Error, LoginForm>({
    mutationFn: apiLogin,
    onSuccess: (response) => {
      if (response.type === "success") {
        const token = response.message.token;
        if (token) {
          setToken(token);
          router.replace("/flights");
        } else {
          console.error("Login successful but no token received in response.");
        }
      } else {
        console.error("Login API returned non-success type:", response);
      }
    },
    onError: (err: any) => {
      console.error("Login Mutation Error:", err);
    },
  });
}
