import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Stack,
  CircularProgress,
  Divider,
  Avatar,
  Paper,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

export default function AllExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const res = await api.get("/admin/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to load expenses", err);
      alert("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const overrideStatus = async (id, status) => {
    if (!window.confirm(`Set this expense as ${status}?`)) return;
    try {
      await api.post(`/admin/expenses/${id}/override`, { status });
      loadExpenses();
    } catch (err) {
      alert("Failed to override");
    }
  };

  const statusChip = (status) => {
    const map = {
      Approved: "success",
      Rejected: "error",
      Waiting: "warning",
      Draft: "default",
    };
    return <Chip label={status} color={map[status] || "default"} size="small" />;
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#fafafa", minHeight: "100vh" }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        All Expenses
      </Typography>

      {expenses.length === 0 ? (
        <Typography color="text.secondary" textAlign="center">
          No expenses found.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {expenses.map((e) => (
            <Accordion
              key={e._id}
              expanded={expanded === e._id}
              onChange={() => setExpanded(expanded === e._id ? null : e._id)}
              sx={{
                border: "1px solid #ddd",
                borderRadius: 2,
                "&:before": { display: "none" },
                bgcolor: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  <Typography fontWeight={600}>
                    {e.category || "Uncategorized"}
                  </Typography>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      {e.claimant?.name || "Unknown"}
                    </Typography>
                    <Typography fontWeight={600}>
                      ₹{e.amountInCompanyCurrency} {e.companyCurrency}
                    </Typography>
                    {statusChip(e.status)}
                    <Typography variant="caption" color="text.secondary">
                      {e.submittedAt
                        ? new Date(e.submittedAt).toLocaleString()
                        : "-"}
                    </Typography>
                  </Stack>
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ bgcolor: "#fafafa", borderTop: "1px solid #eee" }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    bgcolor: "#fff",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    Claimant Details
                  </Typography>
                  <Typography variant="body2">
                    <strong>Name:</strong> {e.claimant?.name || "-"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Category:</strong> {e.category || "-"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Amount:</strong> ₹{e.amountInCompanyCurrency} {e.companyCurrency}
                  </Typography>
                </Paper>

                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  Approval Progress
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {e.approvals && e.approvals.length > 0 ? (
                  <Stack spacing={1.2}>
                    {e.approvals.map((a, idx) => (
                      <Box
                        key={idx}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          p: 1.2,
                          border: "1px solid #eee",
                          borderRadius: 2,
                          bgcolor: "#fff",
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar
                            sx={{
                              width: 26,
                              height: 26,
                              fontSize: 13,
                              bgcolor: "#52a4b0",
                            }}
                          >
                            {a.approver?.name
                              ? a.approver.name.charAt(0).toUpperCase()
                              : "?"}
                          </Avatar>
                          <Typography variant="body2" fontWeight={500}>
                            {a.approver?.name || "Unknown"}
                          </Typography>
                        </Stack>
                        <Chip
                          label={a.decision || "Pending"}
                          color={
                            a.decision === "Approved"
                              ? "success"
                              : a.decision === "Rejected"
                              ? "error"
                              : "warning"
                          }
                          size="small"
                        />
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontStyle="italic"
                    sx={{ mt: 1 }}
                  >
                    No approval records available.
                  </Typography>
                )}

                <Stack direction="row" justifyContent="flex-end" spacing={1.5} mt={3}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => overrideStatus(e._id, "Approved")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => overrideStatus(e._id, "Rejected")}
                  >
                    Reject
                  </Button>
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      )}
    </Box>
  );
}
