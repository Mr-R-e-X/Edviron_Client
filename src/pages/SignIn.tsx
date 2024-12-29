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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { loginAdmin, loginSchoolAdmin } from "@/constants/config";
import { useAppDispatch } from "@/hooks/hooks";
import { useToast } from "@/hooks/use-toast";
import { loginSchema } from "@/schema/authSchema";
import { setUser } from "@/store/slices/authSlice";
import { ApiError } from "@/types/response.types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Layout from "../Layouts/Layout";

const SignIn = () => {
  const [loading, isLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      type: "Admin",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      isLoading(true);
      let response;
      if (data.type === "Admin") {
        response = await axios.post(
          loginAdmin,
          { email: data.email, password: data.password },
          {
            withCredentials: true,
          }
        );
      } else {
        response = await axios.post(
          loginSchoolAdmin,
          { email: data.email, password: data.password },
          { withCredentials: true }
        );
      }

      if (response.status === 200) {
        toast({
          title: response.data.message || "Login Successful",
          variant: "default",
          duration: 5000,
        });

        dispatch(
          setUser({
            id: response.data.id,
            email: response.data.email,
            role: response.data.role,
            school_id: response.data?.school_id,
          })
        );
        form.reset();
        navigate("/");
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
            Please login to continue!!
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Account Type
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <RadioGroupItem
                            value="Admin"
                            className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">
                            Admin
                          </span>
                        </label>
                        <label className="flex items-center">
                          <RadioGroupItem
                            value="School"
                            className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">
                            School
                          </span>
                        </label>
                      </div>
                    </RadioGroup>
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
                    <Loader2 className="animate-spin h-4 w-4" /> Submit
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </Form>
        <div className="flex flex-wrap justify-center gap-3 ">
          <p className="text-center text-lg text-gray-700 dark:text-gray-300">
            Sign up as{" "}
            <a
              href="/signup/admin"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-600"
            >
              Admin
            </a>{" "}
            .
          </p>
          <p className="text-center text-lg text-gray-700 dark:text-gray-300">
            {" "}
            Or
          </p>
          <p className="text-center text-lg text-gray-700 dark:text-gray-300">
            Sign up as{" "}
            <a
              href="/signup/school-admin"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-600"
            >
              School Admin
            </a>{" "}
            .
          </p>
        </div>
      </div>
    </div>
  );
};

const SignInPage = Layout(SignIn, {
  title: "Sign In",
  description: "Sign in to continue",
});

export default SignInPage;
