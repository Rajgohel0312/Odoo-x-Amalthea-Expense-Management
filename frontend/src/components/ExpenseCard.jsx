import { Card, CardContent, Typography, Chip, Stack, Divider, IconButton, Tooltip } from "@mui/material";
import { Visibility } from "@mui/icons-material";

export default function ExpenseCard({ expense, onView }) {
  const { description, category, dateSpent, amountInCompanyCurrency, companyCurrency, status } = expense;

  const statusColors = {
    Approved: "success",
    Rejected: "error",
    Pending: "warning",
    Draft: "default",
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        transition: "0.2s",
        "&:hover": { boxShadow: "0 4px 10px rgba(0,0,0,0.1)" },
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight={600}>
            {description || "Untitled Expense"}
          </Typography>
          <Chip label={status} color={statusColors[status] || "default"} size="small" />
        </Stack>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {category} • {new Date(dateSpent).toLocaleDateString()}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight={600}>
            ₹{amountInCompanyCurrency} {companyCurrency}
          </Typography>
          <Tooltip title="View Approval Timeline">
            <IconButton color="primary" onClick={onView}>
              <Visibility />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
}
