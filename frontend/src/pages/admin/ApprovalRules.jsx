import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Divider,
  Stack,
  Chip,
} from "@mui/material";

export default function ApprovalRules() {
  const [rules, setRules] = useState([]);
  const [form, setForm] = useState({
    name: "",
    approvers: [{ type: "ManagerSlot", order: 1 }],
    conditional: { type: "none", percentageRequired: 0, specificApprover: "" },
  });
  const [companyUsers, setCompanyUsers] = useState([]);

  useEffect(() => {
    fetchRules();
    fetchUsers();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await api.get("/admin/approval-rules");
      setRules(res.data);
    } catch {
      alert("Failed to load rules");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setCompanyUsers(res.data);
    } catch {}
  };

  const addApproverSlot = () =>
    setForm({
      ...form,
      approvers: [
        ...form.approvers,
        { type: "Role", role: "Finance", order: form.approvers.length + 1 },
      ],
    });

  const handleApproverChange = (idx, key, value) => {
    const arr = [...form.approvers];
    arr[idx][key] = value;
    setForm({ ...form, approvers: arr });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = JSON.parse(JSON.stringify(form));
      if (payload.conditional?.specificApprover === "") {
        delete payload.conditional.specificApprover;
      }
      if (payload.conditional?.type === "none") {
        delete payload.conditional;
      }
      await api.post("/admin/approval-rules", payload);
      alert("Rule created successfully");
      setForm({
        name: "",
        approvers: [{ type: "ManagerSlot", order: 1 }],
        conditional: { type: "none", percentageRequired: 0, specificApprover: "" },
      });
      fetchRules();
    } catch {
      alert("Create rule failed");
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#fafafa", minHeight: "100vh" }}>
      <Typography
        variant="h5"
        fontWeight={600}
        mb={3}
        sx={{ letterSpacing: 0.2, color: "#333" }}
      >
        Approval Rules
      </Typography>

      <Grid container spacing={3}>
        {/* LEFT: Create Rule */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e5e7eb",
              bgcolor: "#fff",
              transition: "0.2s ease",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="#333"
              mb={2}
            >
              Create a New Rule
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Rule Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                fullWidth
                required
                size="small"
                sx={{ mb: 2 }}
              />

              <Typography
                variant="subtitle2"
                fontWeight={600}
                mb={1}
                color="text.secondary"
              >
                Approver Steps
              </Typography>

              {form.approvers.map((slot, idx) => (
                <Paper
                  key={idx}
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    border: "1px solid #e5e7eb",
                    bgcolor: "#fafafa",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems="center"
                  >
                    <FormControl sx={{ minWidth: 160 }} size="small">
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={slot.type}
                        label="Type"
                        onChange={(e) =>
                          handleApproverChange(idx, "type", e.target.value)
                        }
                      >
                        <MenuItem value="ManagerSlot">
                          Manager (Claimant’s Manager)
                        </MenuItem>
                        <MenuItem value="Role">Role</MenuItem>
                        <MenuItem value="User">Specific User</MenuItem>
                      </Select>
                    </FormControl>

                    {slot.type === "Role" && (
                      <TextField
                        label="Role (e.g. Finance)"
                        value={slot.role || ""}
                        onChange={(e) =>
                          handleApproverChange(idx, "role", e.target.value)
                        }
                        size="small"
                      />
                    )}

                    {slot.type === "User" && (
                      <FormControl sx={{ minWidth: 200 }} size="small">
                        <InputLabel>User</InputLabel>
                        <Select
                          value={slot.user || ""}
                          label="User"
                          onChange={(e) =>
                            handleApproverChange(idx, "user", e.target.value)
                          }
                        >
                          <MenuItem value="">-- Select User --</MenuItem>
                          {companyUsers.map((u) => (
                            <MenuItem key={u._id} value={u._id}>
                              {u.name} ({u.role})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}

                    <TextField
                      label="Order"
                      type="number"
                      value={slot.order}
                      onChange={(e) =>
                        handleApproverChange(idx, "order", Number(e.target.value))
                      }
                      size="small"
                      sx={{ width: 100 }}
                    />
                  </Stack>
                </Paper>
              ))}

              <Button
                variant="text"
                onClick={addApproverSlot}
                sx={{
                  textTransform: "none",
                  color: "#52a4b0",
                  fontWeight: 500,
                  "&:hover": { bgcolor: "#e8f5f7" },
                }}
              >
                + Add Step
              </Button>

              <Divider sx={{ my: 3 }} />

              <Typography
                variant="subtitle2"
                fontWeight={600}
                mb={1}
                color="text.secondary"
              >
                Conditional Settings
              </Typography>

              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Condition Type</InputLabel>
                <Select
                  value={form.conditional.type}
                  label="Condition Type"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      conditional: {
                        ...form.conditional,
                        type: e.target.value,
                      },
                    })
                  }
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="specific">Specific Approver</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>

              {(form.conditional.type === "percentage" ||
                form.conditional.type === "hybrid") && (
                <TextField
                  label="Percentage Required"
                  type="number"
                  size="small"
                  value={form.conditional.percentageRequired || 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      conditional: {
                        ...form.conditional,
                        percentageRequired: Number(e.target.value),
                      },
                    })
                  }
                  fullWidth
                  sx={{ mb: 2 }}
                />
              )}

              {(form.conditional.type === "specific" ||
                form.conditional.type === "hybrid") && (
                <FormControl fullWidth size="small">
                  <InputLabel>Specific Approver</InputLabel>
                  <Select
                    value={form.conditional.specificApprover || ""}
                    label="Specific Approver"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        conditional: {
                          ...form.conditional,
                          specificApprover: e.target.value,
                        },
                      })
                    }
                  >
                    <MenuItem value="">
                      -- Select Specific Approver (CFO etc) --
                    </MenuItem>
                    {companyUsers.map((u) => (
                      <MenuItem key={u._id} value={u._id}>
                        {u.name} ({u.role})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  bgcolor: "#52a4b0",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#3a8d99" },
                }}
              >
                Create Rule
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT: Existing Rules */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e5e7eb",
              bgcolor: "#fff",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} mb={2} color="#333">
              Existing Rules
            </Typography>

            {rules.length === 0 ? (
              <Typography color="text.secondary" fontSize={14}>
                No rules have been created yet.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {rules.map((r) => (
                  <Paper
                    key={r._id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid #e5e7eb",
                      transition: "0.2s ease",
                      "&:hover": {
                        borderColor: "#52a4b0",
                        bgcolor: "#f9fefe",
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography fontWeight={600}>{r.name}</Typography>
                      <Chip
                        label={r.conditional?.type || "None"}
                        size="small"
                        sx={{
                          bgcolor: "#e0f3f5",
                          color: "#11646c",
                          fontWeight: 500,
                        }}
                      />
                    </Stack>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Steps:
                    </Typography>
                    <ul style={{ marginLeft: 20, color: "#555", marginTop: 4 }}>
                      {r.approvers.map((a) => (
                        <li key={a._id || `${a.type}-${a.order}`}>
                          {a.type} {a.role ? `(${a.role})` : ""}{" "}
                          {a.user ? `(user ${a.user.name || a.user})` : ""} —{" "}
                          Order {a.order}
                        </li>
                      ))}
                    </ul>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
