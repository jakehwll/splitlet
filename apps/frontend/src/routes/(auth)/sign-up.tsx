import z from "zod";
import { useForm } from "@tanstack/react-form";
import { Logo } from "../../components/base/logo/logo";
import { useNavigate } from "react-router";
import { authClient } from "../../utils/auth";
import { Input } from "../../components/base/input/input";
import { Button } from "../../components/base/buttons/button";

const formSchema = z
  .object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(1),
    confirmPassword: z.string().min(1),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

const SignUp = () => {
  const navigate = useNavigate();

  const defaultValues: z.infer<typeof formSchema> = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const form = useForm({
    defaultValues,
    onSubmit: async (formData) => {
      await authClient.signUp.email(
        {
          name: formData.value.name,
          email: formData.value.email,
          password: formData.value.password,
        },
        {
          onSuccess() {
            navigate("/");
          },
        }
      );
    },
  });

  return (
    <>
      <div className="max-w-xs w-full mx-auto flex flex-col gap-8">
        <Logo />
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="name"
            validators={{
              onBlur: formSchema.shape.name,
            }}
            children={(field) => (
              <Input
                label="Name"
                placeholder="John Doe"
                type={"text"}
                value={field.state.value as string}
                onBlur={field.handleBlur}
                onChange={(value) => field.handleChange(value)}
                isInvalid={field.state.meta.errors.length > 0}
                hint={
                  field.state.meta.errors.length > 0 && field.state.meta.errors[0]
                    ? field.state.meta.errors[0].message
                    : undefined
                }
              />
            )}
          />
          <form.Field
            name="email"
            validators={{
              onBlur: formSchema.shape.email,
            }}
            children={(field) => (
              <Input
                label="Email"
                placeholder="john.doe@example.com"
                type={"email"}
                value={field.state.value as string}
                onBlur={field.handleBlur}
                onChange={(value) => field.handleChange(value)}
                isInvalid={field.state.meta.errors.length > 0}
                hint={
                  field.state.meta.errors.length > 0 && field.state.meta.errors[0]
                    ? field.state.meta.errors[0].message
                    : undefined
                }
              />
            )}
          />
          <form.Field
            name="password"
            validators={{
              onBlur: formSchema.shape.password,
            }}
            children={(field) => (
              <Input
                label="Password"
                placeholder="••••••••••••"
                type={"password"}
                value={field.state.value as string}
                onBlur={field.handleBlur}
                onChange={(value) => field.handleChange(value)}
                isInvalid={field.state.meta.errors.length > 0}
                hint={
                  field.state.meta.errors.length > 0 && field.state.meta.errors[0]
                    ? field.state.meta.errors[0].message
                    : undefined
                }
              />
            )}
          />
          <form.Field
            name="confirmPassword"
            validators={{
              onBlur: formSchema.shape.confirmPassword,
            }}
            children={(field) => (
              <Input
                label="Confirm Password"
                placeholder="••••••••••••"
                type={"password"}
                value={field.state.value as string}
                onBlur={field.handleBlur}
                onChange={(value) => field.handleChange(value)}
                isInvalid={field.state.meta.errors.length > 0}
                hint={
                  field.state.meta.errors.length > 0 && field.state.meta.errors[0]
                    ? field.state.meta.errors[0].message
                    : undefined
                }
              />
            )}
          />
          <Button type={"submit"}>Sign Up</Button>
        </form>
        <div className="text-center text-sm">
          <p>
            Already have an account?{" "}
            <a href={"/auth/sign-in"} className="text-brand-500">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
