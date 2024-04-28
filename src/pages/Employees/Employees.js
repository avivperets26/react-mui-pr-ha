import React, { useState, useEffect } from "react";
import EmployeeForm from "./EmployeeForm";
import PageHeader from "../../components/PageHeader";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
  Checkbox,
} from "@material-ui/core";
import useTable from "../../components/useTable";
import * as employeeService from "../../services/employeeService";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Popup from "../../components/Popup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  searchInput: {
    flex: "1 1 30%",
  },
  selectInput: {
    padding: theme.spacing(3),

    flex: "30% 0 50%",
    marginRight: theme.spacing(2),
  },

  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  newButton: {
    flex: "0 1 20%",
    padding: "15px 15px",
  },
  deleteButton: {
    flex: "20% 0 30%",
    padding: "15px 15px",
  },
}));

const headCells = [
  { id: "select", label: "Select", disableSorting: true },
  { id: "fullName", label: "Employee Name" },
  { id: "email", label: "Email Address (Personal)" },
  { id: "mobile", label: "Mobile Number" },
  { id: "department", label: "Department" },
  { id: "actions", label: "Actions", disableSorting: true },
];

export default function Employees() {
  const classes = useStyles();
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [records, setRecords] = useState(employeeService.getAllEmployees());
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [openPopup, setOpenPopup] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [departmentFilter, setDepartmentFilter] = useState(""); // Add departmentFilter state
  const [selected, setSelected] = useState([]); // Add selected state

  useEffect(() => {
    // Update the records state based on the departmentFilter
    setRecords(
      departmentFilter
        ? employeeService
            .getAllEmployees()
            .filter((e) => e.departmentId === departmentFilter)
        : employeeService.getAllEmployees()
    );
  }, [departmentFilter]);

  const handleDepartmentChange = (event) => {
    // Add handleDepartmentChange function
    console.log(event.target.value);
    setDepartmentFilter(event.target.value);
  };
  const departmentOptions = employeeService
    .getDepartmentCollection()
    .map((item) => ({
      id: item.id,
      title: item.name,
    })); // Add departmentOptions

  // const departmentExists = departmentOptions.some(
  //   (option) => option.id === values.departmentId
  // );

  // const departmentValue = departmentExists ? values.departmentId : 0;

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);

  const handleSearch = (e) => {
    // Add handleSearch function
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value === "") return items;
        else
          return items.filter(
            (x) => x.fullName.toLowerCase().includes(target.value.toLowerCase()) // Search by fullName field only for now (you can add more fields to search)
          );
      },
    });
  };

  const addOrEdit = (employee, resetForm) => {
    if (employee.id === 0) employeeService.insertEmployee(employee);
    else employeeService.updateEmployee(employee);
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
    setRecords(employeeService.getAllEmployees());
    setNotify({
      isOpen: true,
      message: "Submitted Successfully",
      type: "success",
    });
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  const onDelete = (id) => {
    // Add onDelete function to handle delete operation for a single record
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    employeeService.deleteEmployee(id);
    setRecords(employeeService.getAllEmployees());
    setNotify({
      isOpen: true,
      message: "Deleted Successfully",
      type: "error",
    });
  };

  const handleSelectAllClick = (event) => {
    // Add handleSelectAllClick function to handle select all checkbox functionality
    if (event.target.checked) {
      const newSelecteds = records.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    // Add handleClick function to handle individual checkbox selection
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1; // Add isSelected function to check if a record is selected or not based on the id of the record

  const handleDeleteSelected = () => {
    // Add handleDeleteSelected function to handle delete operation for multiple records at once (selected records)
    setConfirmDialog({
      isOpen: true,
      title: "Are you sure you want to delete the selected employees?",
      subTitle: "You can't undo this operation",
      onConfirm: () => {
        deleteSelected();
      },
    });
  };

  const deleteSelected = () => {
    // Add deleteSelected function to handle delete operation for multiple records at once (selected records)
    employeeService.deleteEmployees(selected);
    setSelected([]);
    setRecords(employeeService.getAllEmployees());
    setNotify({
      isOpen: true,
      message: "Deleted Successfully",
      type: "error",
    });
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false, // Close the dialog after the action
    });
  };

  return (
    <>
      <PageHeader
        title="New Employee"
        subTitle="Form design with validation"
        icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
      />
      <Paper className={classes.pageContent}>
        <Toolbar className={classes.toolbar}>
          <Controls.Button // Add a delete button to delete selected records at once (multiple records)
            text="Delete Selected"
            variant="outlined"
            startIcon={<DeleteIcon />}
            className={classes.deleteButton}
            onClick={handleDeleteSelected}
            disabled={selected.length === 0}
          />
          <Controls.Input
            label="Search Employees"
            className={classes.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            onChange={handleSearch}
          />
          <Controls.Select
            className={classes.selectInput}
            name="departmentFilter"
            label="Department"
            value={departmentFilter}
            onChange={handleDepartmentChange}
            options={departmentOptions}
          />

          <Controls.Button
            text="Add New"
            variant="outlined"
            startIcon={<AddIcon />}
            className={classes.newButton}
            onClick={() => {
              setOpenPopup(true);
              setRecordForEdit(null);
            }}
          />
        </Toolbar>

        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map((item) => (
              <TableRow key={item.id}>
                <TableCell padding="checkbox">
                  <Checkbox // Add a checkbox for each record to allow selection of multiple records at once
                    checked={isSelected(item.id)}
                    onChange={(event) => handleClick(event, item.id)}
                  />
                </TableCell>
                <TableCell>{item.fullName}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.mobile}</TableCell>
                <TableCell>{item.department}</TableCell>
                <TableCell>
                  <Controls.ActionButton
                    color="primary"
                    onClick={() => {
                      openInPopup(item);
                    }}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </Controls.ActionButton>
                  <Controls.ActionButton
                    color="secondary"
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: "Are you sure you want to delete this record?",
                        subTitle: "You can't undo this operation",
                        onConfirm: () => {
                          onDelete(item.id);
                        },
                      });
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </Controls.ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
      <Popup
        title="Employee Form"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <EmployeeForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}
