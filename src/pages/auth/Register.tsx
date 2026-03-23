import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { axiosClient } from "@/api/axiosClient";
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

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError(null);
      await axiosClient.post("/auth/register", data);
      setSuccess(true);
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (err: unknown) {
      let message = "Failed to register. Please try again";

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
          Create an account
        </CardTitle>
        <CardDescription>
          Enter your details below to create your LibraryFlow account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="p-4 bg-green-100 text-green-800 rounded-md text-center">
            Registration successful! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-white bg-destructive/90 rounded-md text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
