USE bamazon;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(30) UNIQUE NOT NULL,
  over_head_costs DECIMAL NOT NULL,
  PRIMARY KEY (department_id)
);