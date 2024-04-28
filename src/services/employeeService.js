const KEYS = {
  employees: "employees",
  employeeId: "employeeId",
};

export const getDepartmentCollection = () => [
  { name: "None", id: 0 },
  { name: "Development", id: 1 },
  { name: "Marketing", id: 2 },
  { name: "Accounting", id: 3 },
  { name: "HR", id: 4 },
];

export function insertEmployee(data) {
  let employees = getAllEmployees();
  data["id"] = generateEmployeeId();
  employees.push(data);
  localStorage.setItem(KEYS.employees, JSON.stringify(employees));
}

export function updateEmployee(data) {
  let employees = getAllEmployees();
  let recordIndex = employees.findIndex((x) => x.id === data.id);
  employees[recordIndex] = { ...data };
  localStorage.setItem(KEYS.employees, JSON.stringify(employees));
}

export function deleteEmployee(id) {
  let employees = getAllEmployees();
  employees = employees.filter((x) => x.id !== id);
  localStorage.setItem(KEYS.employees, JSON.stringify(employees));
}

export function generateEmployeeId() {
  if (localStorage.getItem(KEYS.employeeId) == null)
    localStorage.setItem(KEYS.employeeId, "0");
  var id = parseInt(localStorage.getItem(KEYS.employeeId));
  localStorage.setItem(KEYS.employeeId, (++id).toString());
  return id;
}

export function getAllEmployees() {
  if (localStorage.getItem(KEYS.employees) == null)
    localStorage.setItem(KEYS.employees, JSON.stringify([]));
  const localEmployees = localStorage.getItem(KEYS.employees);
  return JSON.parse(localEmployees);
}

export function deleteEmployees(idsToDelete) {
  let employees = getAllEmployees(); // Get all the employees
  employees = employees.filter(
    // Filter the employees
    (employee) => !idsToDelete.includes(employee.id) // Remove the employees with the ids to delete
  );
  localStorage.setItem(KEYS.employees, JSON.stringify(employees)); // Save the updated list of employees
}
