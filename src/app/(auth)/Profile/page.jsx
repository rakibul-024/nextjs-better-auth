"use client";

import { FloppyDisk } from "@gravity-ui/icons";
import { changePassword, updateUser } from "@/lib/auth-client";
import {
  Button,
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  TextField,
  toast,
} from "@heroui/react";

export default function ProfilePage() {
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = Object.fromEntries(formData.entries());
    console.log("data from the profile form", userData);

    try {
      const { error } = await updateUser({
        name: userData.name,
      });

      if (error) {
        console.error("Failed to update profile name", error);
        toast.danger("Could not update your name", {
          description: error.message,
        });
        return;
      }

      toast.success("Your name has been updated");
    } catch (error) {
      console.error("Failed to update profile name", error);
      toast.danger("Could not update your name", {
        description: "Please try again.",
      });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const { error } = await changePassword({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        revokeOtherSessions: true,
      });

      if (error) {
        console.error("Failed to change password", error);
        toast.danger("Could not change your password", {
          description: error.message,
        });
        return;
      }

      toast.success("Your password has been changed");
      form.reset();
    } catch (error) {
      console.error("Failed to change password", error);
      toast.danger("Could not change your password", {
        description: "Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Form className="w-full max-w-96" onSubmit={handleUpdateUser}>
        <Fieldset>
          <Fieldset.Legend>Profile Settings</Fieldset.Legend>
          <Description>Update your profile information.</Description>
          <FieldGroup>
            <TextField
              isRequired
              name="name"
              validate={(value) => {
                if (value.length < 3) {
                  return "Name must be at least 3 characters";
                }

                return null;
              }}
            >
              <Label>Name</Label>
              <Input placeholder="John Doe" />
              <FieldError />
            </TextField>
          </FieldGroup>
          <Fieldset.Actions>
            <Button type="submit">
              <FloppyDisk />
              Save changes
            </Button>
            <Button type="reset" variant="secondary">
              Cancel
            </Button>
          </Fieldset.Actions>
        </Fieldset>
      </Form>

      <Form className="w-full max-w-96" onSubmit={handleChangePassword}>
        <Fieldset>
          <Fieldset.Legend>Change Password</Fieldset.Legend>
          <Description>Enter your current password and choose a new one.</Description>
          <FieldGroup>
            <TextField isRequired name="currentPassword" type="password">
              <Label>Current password</Label>
              <Input placeholder="Enter current password" />
              <FieldError />
            </TextField>
            <TextField
              isRequired
              minLength={8}
              name="newPassword"
              type="password"
              validate={(value) => {
                if (value.length < 8) {
                  return "Password must be at least 8 characters";
                }

                return null;
              }}
            >
              <Label>New password</Label>
              <Input placeholder="Enter new password" />
              <FieldError />
            </TextField>
          </FieldGroup>
          <Fieldset.Actions>
            <Button type="submit">Change password</Button>
            <Button type="reset" variant="secondary">
              Cancel
            </Button>
          </Fieldset.Actions>
        </Fieldset>
      </Form>
    </div>
  );
}
