"use client";

import { resetPassword } from "@/lib/auth-client";
import {
  Button,
  FieldError,
  Fieldset,
  Form,
  Input,
  Label,
  TextField,
  toast,
} from "@heroui/react";

export default function ResetPasswordPage() {
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const token = new URL(window.location.href).searchParams.get("token");

    if (!token) {
      toast.danger("Invalid reset link", {
        description: "Request a new password reset email and use its link.",
      });
      return;
    }

    const formData = new FormData(form);

    try {
      const { error } = await resetPassword({
        newPassword: formData.get("newPassword"),
        token,
      });

      if (error) {
        console.error("Password reset failed", error);
        toast.danger("Could not reset your password", {
          description: error.message,
        });
        return;
      }

      toast.success("Password has been reset", {
        description: "You can now sign in with your new password.",
      });
      form.reset();
    } catch (error) {
      console.error("Password reset failed", error);
      toast.danger("Could not reset your password", {
        description: "Please request a new reset link and try again.",
      });
    }
  };

  return (
    <Form className="w-full max-w-96" onSubmit={handleResetPassword}>
      <Fieldset>
        <Fieldset.Legend>Reset Password</Fieldset.Legend>
        <TextField
          isRequired
          minLength={8}
          name="newPassword"
          type="password"
          validate={(value) =>
            value.length < 8 ? "Password must be at least 8 characters" : null
          }
        >
          <Label>New password</Label>
          <Input placeholder="Enter a new password" />
          <FieldError />
        </TextField>
        <Fieldset.Actions>
          <Button type="submit">Reset password</Button>
        </Fieldset.Actions>
      </Fieldset>
    </Form>
  );
}