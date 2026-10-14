"use client";

import { requestPasswordReset } from "@/lib/auth-client";
import {Check} from "@gravity-ui/icons";
import {Button, FieldError, Form, Input, Label, TextField} from "@heroui/react";
import { toast } from "@heroui/react/toast";

export default function ForgotPassword() {
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = Object.fromEntries(formData.entries());

    try {
      const { error } = await requestPasswordReset({
        email: userData.email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error("Password reset request failed", error);
        toast.danger("Could not request a password reset", {
          description: error.message,
        });
        return;
      }

      toast.success("Password reset requested", {
        description: "If this email has an account, a reset link will be sent.",
      });
    } catch (error) {
      console.error("Password reset request failed", error);
      toast.danger("Could not request a password reset", {
        description: "Please try again later.",
      });
    }
  };
  return (
    <Form className="flex w-96 flex-col gap-4" onSubmit={handleForgotPassword}>
      <TextField
        isRequired
        name="email"
        type="email"
        validate={(value) => {
          if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
            return "Please enter a valid email address";
          }

          return null;
        }}
      >
        <Label>Email</Label>
        <Input placeholder="john@example.com" />
        <FieldError />
      </TextField>

      <div className="flex gap-2">
        <Button type="submit">
          <Check />
          Submit
        </Button>
        <Button type="reset" variant="secondary">
          Reset
        </Button>
      </div>
    </Form>
  );
}