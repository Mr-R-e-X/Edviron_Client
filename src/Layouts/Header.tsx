import { Toggle } from "@/components/ui/toggle";
import { Sun, Moon, Loader2 } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import axios, { AxiosError } from "axios";
import { logout } from "@/constants/config";
import { resetUser } from "@/store/slices/authSlice";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/types/response.types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { userExists } = useAppSelector((state) => state.auth);
  const isDarkMode = theme === "dark";
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  const handleLogInOrLogout = async () => {
    if (userExists) {
      try {
        setLoading(true);
        const response = await axios.get(logout, {
          withCredentials: true,
        });
        console.log(response);
        if (response.status === 200) {
          dispatch(resetUser());
          toast({
            title: response.data.message || "Logout successful",
            description: "You have been logged out successfully",
          });
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
        setLoading(false);
      }
    } else {
      navigate("/signin");
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-row justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            EduPayHub
          </h1>
          <div className="flex flex-row gap-4 items-center">
            <Toggle onClick={handleToggle} aria-label="Toggle theme">
              {isDarkMode ? (
                <Moon className="text-blue-500" />
              ) : (
                <Sun className="text-yellow-600" />
              )}
            </Toggle>
            <Button
              variant={userExists ? "destructive" : "default"}
              onClick={handleLogInOrLogout}
              disabled={loading}
            >
              {userExists ? "Logout" : "Login"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
