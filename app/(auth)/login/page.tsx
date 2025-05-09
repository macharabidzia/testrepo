"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib";

import { useLoginMutation } from "@/features/login/hooks/useLoginMutations";

import Button from "@/components/Button";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginFormSchema } from "@/constants/validators";

type LoginFormSchema = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      userName: "",
      password: "",
      channel: "ADMIN",
    },
  });

  const loginMutation = useLoginMutation({ router });

  useEffect(() => {
    if (typeof window !== "undefined" && getToken()) {
      router.replace("/flights");
    }
  }, [router]);

  const onSubmit: SubmitHandler<LoginFormSchema> = (data) => {
    loginMutation.mutate(data);
  };

  const isLoading = loginMutation.isPending || isFormSubmitting;
  const error = loginMutation.error ? loginMutation.error.message : null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
        {(error || Object.keys(errors).length > 0) && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm"
            role="alert"
          >
            {error ||
              Object.values(errors)
                .map((err) => err?.message)
                .join(" ")}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="userName"
              {...register("userName")}
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.userName ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.userName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.userName.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <input type="hidden" {...register("channel")} />

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? "Logging In..." : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
