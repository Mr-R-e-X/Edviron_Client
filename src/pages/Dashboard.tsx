import { Button } from "@/components/ui/button";
import {
  getAllTransaction,
  getAllTransactionBySchool,
} from "@/constants/config";
import { useAppSelector } from "@/hooks/hooks";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/Layouts/Layout";
import { setLoading } from "@/store/slices/authSlice";
import { ApiError } from "@/types/response.types";
import { PaymentTransaction } from "@/types/transaction.types";
import axios, { AxiosError } from "axios";
import { Clipboard, IndianRupee, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardContent = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [allTransactions, setAllTransactions] = useState<PaymentTransaction[]>(
    []
  );
  const [filteredTransactions, setFilteredTransactions] = useState<
    PaymentTransaction[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSchool, setFilterSchool] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const itemsPerPage = 20;

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  const fetchAllTransactions = useCallback(async () => {
    if (user?.role === "Admin") {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${getAllTransaction}?page=${currentPage}`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setAllTransactions(response.data.data as PaymentTransaction[]);
          setCurrentPage(response.data.currentPage);
          setTotalPage(response.data.totalPages);
          toast({
            title:
              response.data.message ||
              "All Transactions Fetched Successfully...!!!",
            variant: "default",
            duration: 5000,
          });
        }
      } catch (error) {
        const err = error as AxiosError<ApiError>;
        toast({
          title: err.response?.data?.message || "Something went wrong",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [user, currentPage, toast]);

  useEffect(() => {
    let filtered = [...allTransactions];

    if (searchTerm) {
      filtered = filtered.filter((transaction) =>
        transaction._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(
        (transaction) => transaction.status === filterStatus
      );
    }

    if (filterSchool) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.school_info.name.toLowerCase() ===
          filterSchool.toLowerCase()
      );
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, filterStatus, filterSchool, allTransactions]);

  useEffect(() => {
    const fecthSchoolAdminData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${getAllTransactionBySchool}/${user?.school_id}`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          console.log(response);
          setAllTransactions(response.data as PaymentTransaction[]);
          toast({
            title:
              response.data.message ||
              "All Transactions Fetched Successfully...!!!",
            variant: "default",
            duration: 5000,
          });
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
    };
    if (user?.role === "School" && user?.school_id) {
      fecthSchoolAdminData();
    }
  }, [toast, isLoading, user?.school_id, user?.role]);

  const copyOrderIdToClipBoard = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    toast({
      title: "Copied to clipboard",
      description: `ID: ${orderId}`,
      variant: "default",
      duration: 3000,
    });
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPage) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    fetchAllTransactions();
  }, [currentPage, fetchAllTransactions]);

  return (
    <div>
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}

      {user?.role === "Admin" && !isLoading && (
        <>
          <h1 className="text-2xl text-center font-bold text-gray-800 dark:text-white my-4">
            Transaction Dashboard
          </h1>

          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search by Order ID"
              className="px-4 py-2 border rounded-md focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="px-4 py-2 border rounded-md focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Filter by Status</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="PENDING">PENDING</option>
              <option value="FAILED">FAILED</option>
            </select>

            <select
              className="px-4 py-2 border rounded-md focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={filterSchool}
              onChange={(e) => setFilterSchool(e.target.value)}
            >
              <option value="">Select School</option>
              {Array.from(
                new Set(allTransactions.map((t) => t.school_info.name))
              ).map((school, index) => (
                <option key={index} value={school}>
                  {school}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <thead className="bg-gray-100 dark:bg-gray-900 border-b">
                <tr>
                  <th className="py-2 px-4 text-left text-base font-medium text-gray-600 dark:text-gray-400">
                    Sl.No
                  </th>
                  <th className="py-2 px-4 text-left text-base font-medium text-gray-600 dark:text-gray-400">
                    School Name
                  </th>
                  <th className="py-2 px-4 text-left text-base font-medium text-gray-600 dark:text-gray-400">
                    Student Name
                  </th>
                  <th className="py-2 px-4 text-left text-base font-medium text-gray-600 dark:text-gray-400">
                    Order ID
                  </th>
                  <th className="py-2 px-4 text-left text-base font-medium text-gray-600 dark:text-gray-400">
                    Transaction Amount
                  </th>
                  <th className="py-2 px-4 text-left text-base font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </th>
                  <th className="py-2 px-4 text-left text-base font-medium text-gray-600 dark:text-gray-400">
                    Payment Method
                  </th>
                  <th className="py-2 px-4 text-left text-base font-medium text-gray-600 dark:text-gray-400">
                    Bank Reference
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((item, index) => {
                  const rowIndex =
                    (currentPage - 1) * itemsPerPage + (index + 1);
                  return (
                    <tr
                      key={item._id}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200">
                        {rowIndex}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200">
                        {item.school_info.name}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200">
                        {item.student_info.first_name}{" "}
                        {item.student_info.middle_name}{" "}
                        {item.student_info.last_name}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200">
                        <div className="flex items-center justify-between gap-3">
                          <span>{item._id}</span>
                          <Clipboard
                            className="cursor-pointer h-4 w-4 text-gray-800 dark:text-gray-200"
                            onClick={() => copyOrderIdToClipBoard(item._id)}
                          />
                        </div>
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200">
                        <div className="flex items-center justify-start gap-1">
                          <span>
                            <IndianRupee className="h-4 w-4" />
                          </span>
                          <span>{item.transaction_amount}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4 text-sm font-bold">
                        <span
                          className={`py-1 px-3 rounded-full text-xs text-white ${
                            item.status === "SUCCESS"
                              ? "bg-green-500"
                              : item.status === "PENDING"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200">
                        {item.payment_method}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200">
                        {item.bank_refrence}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4 mx-6">
            <Button
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPage}
            </span>
            <Button
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPage}
            >
              Next
            </Button>
          </div>
        </>
      )}

      {user?.role === "School" && (
        <>
          <h1 className="text-2xl text-center font-bold text-gray-800 dark:text-white my-4">
            School Transaction Dashboard
          </h1>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <thead className="bg-gray-100 dark:bg-gray-900 border-b">
                <tr>
                  <th className="py-2 px-4 text-left text-base font-medium text-gray-600 dark:text-gray-400">
                    Sl.No
                  </th>
                  <th className="py-2 px-4 text-left text-base font-medium text-gray-600 dark:text-gray-400">
                    School Name
                  </th>
                  <th className="py-2 px-4 text-left text-base font-medium text-gray-600 dark:text-gray-400">
                    Student Name
                  </th>
                  <th className="py-2 px-4 text-left text-base font-medium text-gray-600 dark:text-gray-400">
                    Order ID
                  </th>
                  <th className="py-2 px-4 text-left text-base font-medium text-gray-600 dark:text-gray-400">
                    Transaction Amount
                  </th>
                  <th className="py-2 px-4 text-left text-base font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </th>
                  <th className="py-2 px-4 text-left text-base font-medium text-gray-600 dark:text-gray-400">
                    Payment Method
                  </th>
                  <th className="py-2 px-4 text-left text-base font-medium text-gray-600 dark:text-gray-400">
                    Bank Reference
                  </th>
                </tr>
              </thead>
              <tbody>
                {allTransactions.map((item, index) => {
                  return (
                    <tr
                      key={item._id}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200">
                        {index + 1}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200">
                        {item.school_info.name}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200">
                        {item.student_info.first_name}{" "}
                        {item.student_info.middle_name}{" "}
                        {item.student_info.last_name}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200">
                        <div className="flex items-center justify-between gap-3">
                          <span>{item._id}</span>
                          <Clipboard
                            className="cursor-pointer h-4 w-4 text-gray-800 dark:text-gray-200"
                            onClick={() => copyOrderIdToClipBoard(item._id)}
                          />
                        </div>
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200">
                        <div className="flex items-center justify-start gap-1">
                          <span>
                            <IndianRupee className="h-4 w-4" />
                          </span>
                          <span>{item.transaction_amount}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4 text-sm font-bold">
                        <span
                          className={`py-1 px-3 rounded-full text-xs text-white ${
                            item.status === "SUCCESS"
                              ? "bg-green-500"
                              : item.status === "PENDING"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200">
                        {item.payment_method}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-800 dark:text-gray-200">
                        {item.bank_refrence}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

const Dashboard = Layout(DashboardContent);

export default Dashboard;
