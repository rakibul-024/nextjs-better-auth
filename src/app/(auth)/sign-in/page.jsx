"use client";
import { sendVerificationEmail, signIn, signOut, useSession } from "@/lib/auth-client";
import {useState} from "react";
import {Eye, EyeSlash} from "@gravity-ui/icons";
import {Button, Description, FieldError, Form, Input, InputGroup, Label, Link, TextField, toast} from "@heroui/react";
import React from 'react';

const SignInPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { data: session, pending: sessionPending } = useSession();

  const handleSocialSignIn = async (provider) => {
    try {
      if (sessionPending) {
        toast.info("Please wait", {
          description: "Your current sign-in status is still loading.",
        });
        return;
      }

      if (session?.user) {
        const { error: signOutError } = await signOut();
        if (signOutError) {
          console.error("Could not end the current session before OAuth sign in", signOutError);
          toast.danger("Could not start sign in", {
            description: signOutError.message,
          });
          return;
        }
      }

      sessionStorage.setItem("show-login-toast", "true");
      const { error } = await signIn.social({
        provider,
        callbackURL: "/",
        errorCallbackURL: "/sign-in",
      });

      if (error) {
        sessionStorage.removeItem("show-login-toast");
        console.error(`Failed to sign in with ${provider}`, error);
        toast.danger("Sign in failed", { description: error.message });
      }
    } catch (error) {
      sessionStorage.removeItem("show-login-toast");
      console.error(`Failed to sign in with ${provider}`, error);
      toast.danger("Sign in failed", { description: "Please try again." });
    }
  };

     const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    sessionStorage.setItem("show-login-toast", "true");
    try {
      const { error } = await signIn.email({
            email: data.email,
            password: data.password,
            rememberMe: true,
            callbackURL: '/'
      });

      if (error) {
        sessionStorage.removeItem("show-login-toast");
        console.error("Email sign in failed", error);
        if (error.code === "EMAIL_NOT_VERIFIED") {
          const { error: emailError } = await sendVerificationEmail({
            email: data.email,
            callbackURL: "/",
          });

          if (emailError) {
            console.error("Could not resend verification email", emailError);
            toast.danger("Could not send verification email", {
              description: emailError.message,
            });
          } else {
            toast.success("Verification email sent", {
              description: "Check your inbox and spam folder for the verification link.",
            });
          }
        } else {
          toast.danger("Sign in failed", { description: error.message });
        }
      }
    } catch (error) {
      sessionStorage.removeItem("show-login-toast");
      console.error("Email sign in failed", error);
      toast.danger("Sign in failed", { description: "Please try again." });
    }

     }

    return (
        <div>
            <h2>please sign in</h2>

 <Form className="flex w-96 flex-col gap-4" onSubmit={onSubmit}>
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
    <p>   Forgot Password <Link href="/forgot-password" className= "text-blue-400 underline"><small>Click here?</small></Link>  </p>
    <div className="flex gap-2 my-4">
      <Button onPress={() => handleSocialSignIn("google")}>
        Sign in with Google
      </Button>
      <Button onPress={() => handleSocialSignIn("github")}>
        Sign in with GitHub
      </Button>
    </div>

        </div>
    );
};

export default SignInPage;