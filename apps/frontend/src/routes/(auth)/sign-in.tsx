import z from "zod";
import { Input } from "../../components/base/input/input";
import { Button } from "../../components/base/buttons/button";
import { useNavigate } from "react-router";
import { useForm } from "@tanstack/react-form";
import { authClient } from "../../utils/auth";
import { Logo } from "../../components/base/logo/logo";

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

const SignIn = () => {
  const navigate = useNavigate();

  const defaultValues: z.infer<typeof formSchema> = {
    email: "",
    password: "",
  };

  const form = useForm({
    defaultValues,
    onSubmit: async (formData) => {
      await authClient.signIn.email({
        email: formData.value.email,
        password: formData.value.password,
        fetchOptions: {
          onSuccess(ctx) {
            navigate("/");
          },
          onError(ctx) {
            console.error(ctx.error);
          },
        },
      });
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
          <div className="flex flex-col gap-3">
            <Button type={"submit"}>Sign In</Button>
            <Button color="tertiary" onClick={() => navigate("/auth/sign-up")}>
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignIn;
