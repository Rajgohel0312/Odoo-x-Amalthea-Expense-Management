import React, { useState } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  FormControlLabel,
  Switch
} from '@mui/material';
import { NavLink } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const initialRules = [
  { 
    id: 1, 
    name: 'Standard Expenses (< $500)', 
    criteria: 'Amount is less than 500 USD', 
    flow: ['Employee\'s Manager', 'Finance Department'],
    conditional: null 
  },
  { 
    id: 2, 
    name: 'High-Value Expenses (>= $500)', 
    criteria: 'Amount is greater than or equal to 500 USD', 
    flow: ['Employee\'s Manager', 'Finance Department', 'Director'],
    conditional: null 
  },
  {
    id: 3,
    name: 'Marketing Project Spend',
    criteria: 'Category is Marketing',
    flow: ['Project Manager', 'Marketing Head'],
    conditional: { type: 'specific', approver: 'CFO' }
  }
];

const availableApprovers = ['Employee\'s Manager', 'Finance Department', 'Director', 'Project Manager', 'Marketing Head', 'CFO'];

const ApprovalRulesPage = () => {
  const [rules, setRules] = useState(initialRules);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRule, setCurrentRule] = useState(null);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentRule({ name: '', criteria: '', flow: ['Employee\'s Manager'], conditional: null });
    setOpen(true);
  };

  const handleOpenEdit = (rule) => {
    setIsEditing(true);
    setCurrentRule(rule);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    if (isEditing) {
      setRules(rules.map(r => r.id === currentRule.id ? currentRule : r));
    } else {
      const newRule = { ...currentRule, id: rules.length + 1 };
      setRules([...rules, newRule]);
    }
    handleClose();
  };
  
  const addApproverStep = () => {
    setCurrentRule(prev => ({...prev, flow: [...prev.flow, '']}));
  };
  
  const handleFlowChange = (value, index) => {
      const newFlow = [...currentRule.flow];
      newFlow[index] = value;
      setCurrentRule(prev => ({...prev, flow: newFlow}));
  };

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={NavLink} underline="hover" color="inherit" to="/">Dashboard</Link>
        <Typography color="text.primary">Approval Rules</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">Approval Flow Configuration</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
            Create New Rule
          </Button>
        </Box>

        <List>
          {rules.map((rule, index) => (
            <React.Fragment key={rule.id}>
              <ListItem
                secondaryAction={
                  <Box>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpenEdit(rule)}><EditIcon /></IconButton>
                    <IconButton edge="end" aria-label="delete" sx={{ ml: 1 }}><DeleteIcon /></IconButton>
                  </Box>
                }
              >
                <ListItemIcon><RuleFolderIcon /></ListItemIcon>
                <ListItemText
                  primary={rule.name}
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      {rule.flow.map((step, i) => (
                        <React.Fragment key={i}>
                          <Chip label={step} size="small" />
                          {i < rule.flow.length - 1 && <ArrowForwardIosIcon sx={{ fontSize: '0.8rem' }} />}
                        </React.Fragment>
                      ))}
                    </Box>
                  }
                />
              </ListItem>
              {index < rules.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Approval Rule' : 'Create New Approval Rule'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Rule Name" type="text" fullWidth variant="outlined" sx={{ mt: 1 }} value={currentRule?.name || ''} onChange={(e) => setCurrentRule({...currentRule, name: e.target.value})}/>
          <TextField margin="dense" label="Criteria Description (e.g., Amount > $500)" type="text" fullWidth variant="outlined" value={currentRule?.criteria || ''} onChange={(e) => setCurrentRule({...currentRule, criteria: e.target.value})}/>
          
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Approval Sequence</Typography>
          <Stepper orientation="vertical" nonLinear>
              {currentRule?.flow.map((step, index) => (
                  <Step key={index} active>
                      <StepLabel>Step {index + 1}</StepLabel>
                      <StepContent>
                           <TextField select fullWidth label="Select Approver" value={step} onChange={(e) => handleFlowChange(e.target.value, index)}>
                                {availableApprovers.map(approver => <MenuItem key={approver} value={approver}>{approver}</MenuItem>)}
                           </TextField>
                      </StepContent>
                  </Step>
              ))}
          </Stepper>
          <Button onClick={addApproverStep} sx={{ mt: 1 }}>Add Step</Button>
          
          <Divider sx={{ my: 3 }}/>
          
          <Typography variant="h6" sx={{ mb: 1 }}>Conditional Logic (Optional)</Typography>
           <FormControlLabel control={<Switch />} label="Enable Conditional Auto-Approval" />
           <Typography variant="body2" color="text.secondary">e.g., If the CFO approves, the expense is auto-approved regardless of other steps.</Typography>
          
        </DialogContent>
        <DialogActions sx={{ p: '0 24px 16px' }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save Rule</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApprovalRulesPage;