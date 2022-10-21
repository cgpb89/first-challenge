Node Code Challenge #1
When:  Early October
What: The NodeJS CoE Code Challenge is a contest-like activity open for every person that wants  to start building awesome NodeJS based systems.  There will be a set of 4 exercises along 4 weeks such a way the participants will have the opportunity to show their NodeJS skills solving real-life scenarios.  Not only the best implementation wins but a raffle among participants will be given.

Instructions

For this challenge, we will be using express-generator, a widely used and well-known code generator utility.
Please follow the instructions to join the challenge:

Join the #coe-node channel in slack where we will be sending the weekly challenges and sharing any other information.

Solve the first challenge:

EMPLOYEES API

Create an application in node.js which manages employees.

The application should manage the following data of an employee: ID, name, surname, level and salary. Name and surname are strings, while ID, level and salary are numeric.

The application should allow you to search an employee using his/her ID. If the employee exists, it will show their data in a json representation, otherwise it will return a 404 status code.

The application should allow you to delete an employee, by specifying his/her ID.

The application should allow inserting a new employee with the given data. If the ID field is left empty, the system will assign the next available ID. If the ID is already associated with an employee, the employee data is overwritten. If the ID is not associated with any employee, the employee is created. All the other fields cannot be empty.

