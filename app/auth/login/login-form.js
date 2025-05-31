"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { firebaseAuth, GoogleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Chrome } from "lucide-react";
import { useFormik } from "formik";
import schema from "@/validators/validate";
import axios from "axios";
import { useState } from "react";
import axiosInstance from "@/axios/instance";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
export default function LoginForm() {
  const [oAuthSignIn, setOAuthSignIn] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    // validationSchema: schema,
    onSubmit: async (values, helpers) => {
      try {
        const res = await login(values);
        helpers.setSubmitting(false);
      } catch (err) {
        console.log(err);
        helpers.setSubmitting(false);
      }
    },
  });
  async function onGoogleButtonPress() {
    try {
      setOAuthSignIn(true);
      const authResult = await signInWithPopup(firebaseAuth, GoogleProvider);
      const user = authResult?.user;
      const tokenId = await user?.getIdToken();
      googleLogin(tokenId);
      navigate.push("/");

      //   const req = await AuthAPI.oAuthSignIn(tokenId);
    } catch (err) {
      console.log(err);
    }
    setOAuthSignIn(false);
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            type="button"
            loading={oAuthSignIn}
            onClick={onGoogleButtonPress}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Continue with Gooxgle
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                error={formik.touched.email && formik.errors.email}
                {...formik.getFieldProps("email")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                error={formik.touched.password && formik.errors.password}
                {...formik.getFieldProps("password")}
                id="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              //   loading={formik.isSubmitting.toString}
            >
              Sign in
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            <a
              href="#"
              className="hover:text-primary underline underline-offset-4"
            >
              Forgot your password?
            </a>
          </div>
          <div className="text-sm text-center text-muted-foreground">
            {"Don't have an account? "}
            <a
              href="#"
              className="hover:text-primary underline underline-offset-4"
            >
              Sign up
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
