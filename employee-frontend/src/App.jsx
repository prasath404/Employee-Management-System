import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link, Routes, Route } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import EmployeeDetails from './components/EmployeeDetails';

function App() {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Employee Manager</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Employees</Nav.Link>
              <Nav.Link as={Link} to="/add">Add Employee</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="py-4">
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/add" element={<EmployeeForm mode="add" />} />
          <Route path="/edit/:id" element={<EmployeeForm mode="edit" />} />
          <Route path="/view/:id" element={<EmployeeDetails />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;

