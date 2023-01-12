import org.junit.jupiter.api.Test;

class EmployeeTest {
    @Test
    void employeeValidType(){
        var e = new Employee( 'a1', 'Jamie tartt', "marketing", '24');
        assertEquals(e.getAge('a1'));
        assertEquals(e.etName('jamie tartt'));
        assertEquals(e.getDepartment('marketing'));
        assertEquals(e.getAge('24'));
    }
    
    @Test
    void invalidtype(){
        var e = new Employee( 1, 'danny rojas', "pr", 23);
        assertEquals(e.getAge('1'));
        assertEquals(e.getName('jamie tartt'));
        assertEquals(e.getDepartment('marketing'));
        assertEquals(e.getAge('24'));
    }

    @Test
    void setCorrectDept(){
        var e = new Employee( 'a2', 'roy kent', "cco", '24');
        e.setDepartment('manager');
        assertEquals('manager', e.getDepartment())
    }
 
}
