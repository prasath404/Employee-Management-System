import { useEffect, useState } from 'react';
import { Button, Card, Spinner, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { EmployeeService } from '../services/EmployeeService';

const headers = ['#', 'First Name', 'Last Name', 'Email', 'Department', 'Salary', 'Date Of Joining', 'Actions'];

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await EmployeeService.list();
      setEmployees(data);
      setError('');
    } catch (err) {
      setError('Failed to load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this employee?');
    if (!confirmed) {
      return;
    }

    try {
      await EmployeeService.remove(id);
      setEmployees((existing) => existing.filter((emp) => emp.id !== id));
    } catch (err) {
      setError('Failed to delete employee.');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h4 className="mb-0">Employees</h4>
          <small className="text-muted">Manage your workforce records</small>
        </div>
        <Button as={Link} to="/add" variant="primary">Add Employee</Button>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {employees.length === 0 ? (
          <p className="text-center mb-0">No employees yet. Start by adding one.</p>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  {headers.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr key={employee.id}>
                    <td>{index + 1}</td>
                    <td>{employee.firstName}</td>
                    <td>{employee.lastName}</td>
                    <td>{employee.email}</td>
                    <td>{employee.department}</td>
                    <td>{Number(employee.salary).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</td>
                    <td>{employee.dateOfJoining}</td>
                    <td className="d-flex gap-2 flex-wrap">
                      <Button as={Link} to={`/view/${employee.id}`} variant="secondary" size="sm">View</Button>
                      <Button as={Link} to={`/edit/${employee.id}`} variant="info" size="sm">Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(employee.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default EmployeeList;

