package com.example.employee.service;

import com.example.employee.dto.EmployeeDTO;
import com.example.employee.entity.Employee;
import com.example.employee.exception.ResourceNotFoundException;
import com.example.employee.repository.EmployeeRepository;
import com.example.employee.service.impl.EmployeeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceImplTest {

    @Mock
    private EmployeeRepository employeeRepository;

    private EmployeeService employeeService;

    @BeforeEach
    void setUp() {
        employeeService = new EmployeeServiceImpl(employeeRepository);
    }

    @Test
    void createEmployee_persistsAndReturnsDto() {
        EmployeeDTO dto = sampleDto();
        Employee savedEntity = sampleEntity();
        savedEntity.setId(1L);

        when(employeeRepository.save(any(Employee.class))).thenReturn(savedEntity);

        EmployeeDTO result = employeeService.createEmployee(dto);

        ArgumentCaptor<Employee> captor = ArgumentCaptor.forClass(Employee.class);
        verify(employeeRepository).save(captor.capture());
        Employee toSave = captor.getValue();

        assertThat(toSave.getEmail()).isEqualTo(dto.getEmail());
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getFirstName()).isEqualTo(dto.getFirstName());
    }

    @Test
    void getEmployeeById_missingThrowsException() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.getEmployeeById(1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("1");
    }

    private EmployeeDTO sampleDto() {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setFirstName("Jane");
        dto.setLastName("Doe");
        dto.setEmail("jane.doe@example.com");
        dto.setDepartment("Engineering");
        dto.setSalary(new BigDecimal("5000"));
        dto.setDateOfJoining(LocalDate.now());
        return dto;
    }

    private Employee sampleEntity() {
        Employee employee = new Employee();
        employee.setFirstName("Jane");
        employee.setLastName("Doe");
        employee.setEmail("jane.doe@example.com");
        employee.setDepartment("Engineering");
        employee.setSalary(new BigDecimal("5000"));
        employee.setDateOfJoining(LocalDate.now());
        return employee;
    }
}

