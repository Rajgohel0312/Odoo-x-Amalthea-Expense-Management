import ExpenseForm from "../../components/ExpenseForm";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ExpenseFormPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-[Helvetica]">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#52a4b0]">
            ✍️ New Expense Submission
          </h1>
          <Link
            to="/employee"
            className="flex items-center gap-1 text-[#52a4b0] hover:text-[#3c8590]"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>

        <p className="text-gray-600 mb-6 text-sm">
          Fill in the details below to submit your expense claim for approval.
        </p>

        <ExpenseForm />
      </div>
    </div>
  );
}
