import { useEffect, useState } from "react";
import { Container, Typography, CircularProgress, Chip, Box } from "@mui/material";
import api from "../../api/axios";

export default function MyExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/expenses/me"); // 🔹 match your backend route
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to load expenses", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      case "Draft":
        return "default";
      default:
        return "warning";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        My Expenses
      </Typography>

      {loading ? (
        <Box textAlign="center" mt={10}>
          <CircularProgress />
          <Typography mt={2} color="text.secondary">
            Loading your expenses...
          </Typography>
        </Box>
      ) : expenses.length === 0 ? (
        <Box textAlign="center" mt={10}>
          <Typography variant="h6" color="text.secondary">
            No expenses found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You haven’t submitted any expense claims yet.
          </Typography>
        </Box>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-[#52a4b0] text-white">
              <tr>
                <th className="py-3 px-4 font-medium">Description</th>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium text-right">Amount</th>
                <th className="py-3 px-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp, index) => (
                <tr
                  key={exp._id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-3 px-4">
                    {exp.description || "No description"}
                  </td>
                  <td className="py-3 px-4">{exp.category || "-"}</td>
                  <td className="py-3 px-4">
                    {new Date(exp.dateSpent).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">
                    ₹{exp.amountInCompanyCurrency} {exp.companyCurrency}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Chip
                      label={exp.status}
                      color={getStatusColor(exp.status)}
                      size="small"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}
