import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Alert, Button, Card, ListGroup, Spinner } from 'react-bootstrap';
import { EmployeeService } from '../services/EmployeeService';

function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    EmployeeService.get(id)
      .then((data) => {
        setEmployee(data);
        setError('');
      })
      .catch(() => setError('Employee not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!employee) return null;

  const currency = Number(employee.salary).toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD'
  });

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">{employee.firstName} {employee.lastName}</h4>
        <Button as={Link} to={`/edit/${employee.id}`} variant="info">Edit</Button>
      </Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item><strong>Email:</strong> {employee.email}</ListGroup.Item>
        <ListGroup.Item><strong>Department:</strong> {employee.department}</ListGroup.Item>
        <ListGroup.Item><strong>Salary:</strong> {currency}</ListGroup.Item>
        <ListGroup.Item><strong>Date Of Joining:</strong> {employee.dateOfJoining}</ListGroup.Item>
      </ListGroup>
      <Card.Footer className="text-end">
        <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
      </Card.Footer>
    </Card>
  );
}

export default EmployeeDetails;

