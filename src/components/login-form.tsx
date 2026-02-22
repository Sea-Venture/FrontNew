import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/store/authStore";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login, isLoading, error } = useAuthStore();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      const user = useAuthStore.getState().user;
      if (user?.accesses?.some(access => access.resource === 'grant_guide')) {
        navigate('/guide');
      } else if (user?.accesses?.some(access => access.resource === 'grant_admin')) {
        navigate('/admin');
      } else {
        navigate('/voyager');
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleLogin} {...props}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <FieldDescription className="text-red-500 text-sm">
              {errors.email}
            </FieldDescription>
          )}
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            required
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <FieldDescription className="text-red-500 text-sm">
              {errors.password}
            </FieldDescription>
          )}
        </Field>

        {error && (
          <Field>
            <FieldDescription className="text-red-500 text-sm text-center">
              {error}
            </FieldDescription>
          </Field>
        )}

        <Field>
          <Button type="submit" color="forest" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="/register" className="underline underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
