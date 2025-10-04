import ExpenseForm from "../../components/ExpenseForm";

export default function EmployeeDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Submit Expense</h1>
      <ExpenseForm />
    </div>
  );
}
