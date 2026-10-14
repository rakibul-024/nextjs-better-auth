'use client'
import React, {useState} from 'react';
import {Eye, EyeSlash} from "@gravity-ui/icons";
import {Button, Description, FieldError, Form, Input, InputGroup, Label, TextField, toast} from "@heroui/react";
import { sendVerificationEmail, signIn, signUp } from '@/lib/auth-client';




const SignUpPage = () => {
  const [isVisible, setIsVisible] = useState(false);

     const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const { error: signUpError } = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (signUpError) {
        console.error("Sign up failed", signUpError);
        if (signUpError.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
          const { error: emailError } = await sendVerificationEmail({
            email: data.email,
            callbackURL: "/",
          });

          if (emailError) {
            console.error("Could not resend verification email", emailError);
            toast.danger("Could not send the verification email", {
              description: emailError.message,
            });
            return;
          }

          toast.success("Verification email sent", {
            description: "Check your inbox and spam folder for the verification link.",
          });
          return;
        }

        toast.danger("Could not create your account", {
          description: signUpError.message,
        });
        return;
      }

      const { error: emailError } = await sendVerificationEmail({
        email: data.email,
        callbackURL: "/",
      });

      if (emailError) {
        console.error("Could not send verification email", emailError);
        toast.danger("Could not send the verification email", {
          description: emailError.message,
        });
        return;
      }

      toast.success("Verification email sent", {
        description: "Check your inbox and spam folder for the verification link.",
      });
    } catch (error) {
      console.error("Sign up or verification email failed", error);
      toast.danger("Could not send the verification email", {
        description: "Please try again later.",
      });
    }

  };

  const handleSocialSignUp = async (provider) => {
    try {
      const { error } = await signIn.social({
        provider,
        callbackURL: "/",
        errorCallbackURL: "/sign-up",
        requestSignUp: true,
      });

      if (error) {
        console.error(`Failed to sign up with ${provider}`, error);
        toast.danger(`${provider} sign up failed`, {
          description: error.message,
        });
      }
    } catch (error) {
      console.error(`Failed to sign up with ${provider}`, error);
      toast.danger(`${provider} sign up failed`, {
        description: "Please try again.",
      });
    }
  };

    return (
        <div>
         <Form className="flex w-96 flex-col gap-4" onSubmit={onSubmit}>

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
            <Input placeholder="Enter your name" />
            <FieldError />
          </TextField>
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
     <TextField
      isRequired
      minLength={8}
      name="password"
      type={isVisible ? "text" : "password"}
      className="w-full max-w-[280px]"
      validate={(value) => {
        if (value.length < 8) {
          return "Password must be at least 8 characters";
        }
        if (!/[A-Z]/.test(value)) {
          return "Password must contain at least one uppercase letter";
        }
        if (!/[0-9]/.test(value)) {
          return "Password must contain at least one number";
        }
        return null;
      }}
    >
      <Label>Password</Label>
      
      <InputGroup>
        <InputGroup.Input
          className="w-full max-w-[280px]"
          placeholder="Enter your password"
        />
        <InputGroup.Suffix className="pe-0">
          <Button
            isIconOnly
            aria-label={isVisible ? "Hide password" : "Show password"}
            size="sm"
            variant="ghost"
            onPress={() => setIsVisible(!isVisible)}
          >
            {isVisible ? <EyeSlash className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </InputGroup.Suffix>
      </InputGroup>

      <Description>Must be at least 8 characters with 1 uppercase and 1 number</Description>
      <FieldError />
    </TextField>
      <div className="flex gap-2">
        <Button type="submit">

          {/* <Check /> */}
          Submit
        </Button>
        <Button type="reset" variant="secondary">
          Reset
        </Button>
      </div>
      </Form>
             <p>or</p>
      <div className="flex gap-2">
        <Button onPress={() => handleSocialSignUp("google")}>
          Sign up with Google
        </Button>
        <Button onPress={() => handleSocialSignUp("github")}>
          Sign up with GitHub
        </Button>
      </div>
      </div>
    );
};

export default SignUpPage;