interface SchoolInfo {
  _id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
}

interface StudentInfo {
  first_name: string;
  last_name: string;
  middle_name: string;
}

export interface PaymentTransaction {
  bank_refrence: string;
  gateway: string;
  payment_method: string;
  school_info: SchoolInfo;
  status: string;
  student_info: StudentInfo;
  transaction_amount: number;
  _id: string;
}
