import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createSchoolAdmin } from "@/constants/config";
import { useToast } from "@/hooks/use-toast";
import { signUpSchoolAdminSchema } from "@/schema/authSchema";
import { ApiError } from "@/types/response.types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Layout from "../Layouts/Layout";

const SignUpSchoolAdmin = () => {
  const [loading, isLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof signUpSchoolAdminSchema>>({
    resolver: zodResolver(signUpSchoolAdminSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      school_id: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchoolAdminSchema>) => {
    try {
      isLoading(true);
      const response = await axios.post(createSchoolAdmin, data);
      console.log(response);
      if (response.status === 201) {
        toast({
          title: response.data.message || "Login Successful",
          variant: "default",
          duration: 5000,
        });

        console.log("Redirecting to signin...");
        navigate("/signin");
      }
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      toast({
        title: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      isLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
      <div className="w-full max-w-xl p-8 space-y-8 rounded-xl border border-gray-300 dark:border-gray-700">
        <div className="text-center">
          <p className="text-lg font-semibold tracking-tight lg:text-xl mb-6 text-gray-800 dark:text-gray-200">
            Please fill the following details to sign up as School Admin
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      {...field}
                      className="py-4 px-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      className="py-4 px-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      type="password"
                      {...field}
                      className="py-4 px-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="school_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    School Id
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="School Id"
                      {...field}
                      className="py-4 px-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row justify-center">
              <Button
                type="submit"
                disabled={loading}
                className="mx-auto px-6 py-3 flex flex-row items-center justify-center gap-2 text-lg bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" /> Signing Up
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
          </form>
        </Form>
        <div className="flex flex-wrap justify-center gap-3 ">
          <p className="text-center text-lg text-gray-700 dark:text-gray-300">
            <a
              href="/signin"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-600"
            >
              Sign In
            </a>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

const SignUpSchoolAdminPage = Layout(SignUpSchoolAdmin, {
  title: "Sign In",
  description: "Sign in to continue",
});

export default SignUpSchoolAdminPage;
