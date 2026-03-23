import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { useState } from "react";
import { axiosClient } from "@/api/axiosClient";
import { fetchSession, loginSuccess } from "@/store/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { AxiosError } from "axios";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      await axiosClient.post("/auth/login", data);
      dispatch(loginSuccess());
      await dispatch(fetchSession())
        .unwrap()
        .catch(() => {});
      navigate("/");
    } catch (err: unknown) {
      let message = "Failed to login. Please check your credentials.";

      if (err instanceof AxiosError) {
        message =
          err.response?.data?.message ??
          err.response?.data?.error ??
          err.message ??
          message;
      }

      setError(message);
    }
  };

  return (
    <Card className="w-full border-none shadow-none bg-transparent">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center mb-4">
          <BookOpen className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-white bg-destructive/90 rounded-md text-center">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
