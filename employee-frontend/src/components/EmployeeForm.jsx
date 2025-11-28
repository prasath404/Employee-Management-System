import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { EmployeeService } from '../services/EmployeeService';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
  salary: '',
  dateOfJoining: ''
};

function EmployeeForm({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(mode === 'edit');

  useEffect(() => {
    if (mode === 'edit' && id) {
      EmployeeService.get(id)
        .then((data) => {
          setEmployee({
            ...data,
            salary: data.salary ?? '',
            dateOfJoining: data.dateOfJoining ?? ''
          });
        })
        .catch(() => setSubmitError('Unable to load employee.'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, mode]);

  const validate = () => {
    const newErrors = {};
    if (!employee.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!employee.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!employee.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(employee.email)) newErrors.email = 'Provide a valid email';
    if (!employee.department.trim()) newErrors.department = 'Department is required';
    if (employee.salary === '' || Number(employee.salary) < 0) newErrors.salary = 'Salary must be zero or more';
    if (!employee.dateOfJoining) newErrors.dateOfJoining = 'Select date of joining';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (mode === 'edit' && id) {
        await EmployeeService.update(id, employee);
      } else {
        await EmployeeService.create(employee);
      }
      navigate('/');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to save employee';
      setSubmitError(msg);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h4 className="mb-0">{mode === 'edit' ? 'Update Employee' : 'Add Employee'}</h4>
      </Card.Header>
      <Card.Body>
        {submitError && <Alert variant="danger">{submitError}</Alert>}
        <Form onSubmit={handleSubmit} noValidate>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={employee.firstName}
                  onChange={handleChange}
                  isInvalid={!!errors.firstName}
                  placeholder="Jane"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={employee.lastName}
                  onChange={handleChange}
                  isInvalid={!!errors.lastName}
                  placeholder="Doe"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lastName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={employee.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  placeholder="jane.doe@example.com"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="department">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  name="department"
                  value={employee.department}
                  onChange={handleChange}
                  isInvalid={!!errors.department}
                  placeholder="Engineering"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.department}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="salary">
                <Form.Label>Salary (USD)</Form.Label>
                <Form.Control
                  type="number"
                  name="salary"
                  min="0"
                  step="0.01"
                  value={employee.salary}
                  onChange={handleChange}
                  isInvalid={!!errors.salary}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.salary}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="dateOfJoining">
                <Form.Label>Date Of Joining</Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfJoining"
                  value={employee.dateOfJoining}
                  onChange={handleChange}
                  isInvalid={!!errors.dateOfJoining}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dateOfJoining}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="outline-secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {mode === 'edit' ? 'Update' : 'Create'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default EmployeeForm;

