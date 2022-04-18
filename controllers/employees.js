const Employee = require("../models/Employee");
const path = require("path");
const fsPrommises = require("fs").promises;
const fs = require("fs");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find().exec();

  //if no employees are found
  if (employees.length === 0) {
    //send a
    return res.status(404).json({ message: "No employees found" });
  }
  //if employees are found
  res.status(200).json({
    message: "Employees found",
    employees,
  });
};

const createNewEmployee = async (req, res) => {
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({
      error: "First and last names are required",
    });
  }
  const newEmployee = {
    firstName: firstName,
    lastName: lastName,
  };

  try {
    const employee = await Employee.create(newEmployee);
    res.status(201).json({
      message: "Employee created",
      employee,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const updateEmployee = async (req, res) => {
  const { firstName, lastName, id } = req.body;

  //if we dont have an id then we cant update
  if (!id) {
    return res.status(400).json({
      error: "Id is required",
    });
  }

  const employee = await Employee.findOne({
    _id: id,
  }).exec();

  if (!employee) {
    return res.status(204).json({
      message: `No employee found with ID ${id}`,
    });
  }

  if (firstName) employee.firstName = req.body.firstName;
  if (lastName) employee.lastName = req.body.lastName;

  //save the employee
  const result = await employee.save();

  console.log(result);

  res.status(200).json({
    message: "Employee updated",
    employee,
  });
};

const deleteEmployee = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      error: "Id is required",
    });
  }

  const employee = await Employee.findOne({ id }).exec();

  if (!employee)
    res.status(400).json({
      message: `Employee ID ${id} not found`,
    });

  //delete the employee
  const result = await Employee.deleteOne({
    _id: id,
  });

  console.log(result);

  res.status(200).json({
    message: "Employee deleted",
  });
};

const getEmployee = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      error: "Id is required",
    });
  }
  const employee = await Employee.findOne({
    _id: id,
  }).exec();

  console.log(employee);
  if (!employee)
    res.status(404).json({
      message: `Employee ID ${id} not found`,
    });

  res.status(200).json({
    message: "Employee found",
    employee,
  });
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
