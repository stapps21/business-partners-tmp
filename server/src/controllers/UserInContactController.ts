require('module-alias/register')
import { Request, Response } from 'express';
import { Employee } from '@entities/Employee';
import { User } from '@entities/User';
import { AppDataSource } from "@config/data-source";

// Express route handler
export async function addUserInContact(req: Request, res: Response) {
    const { employeeId, userId } = req.body;

    // Validate input
    if (!employeeId || !userId) {
        return res.status(400).json({ message: 'Employee ID and User ID are required.' });
    }

    try {
        const employeeRepository = AppDataSource.getRepository(Employee);
        const userRepository = AppDataSource.getRepository(User);

        // Find employee and user
        const employee = await employeeRepository.findOne({ where: { id: employeeId } });
        const user = await userRepository.findOne({ where: { id: userId } });

        // Check if both entities exist
        if (!employee || !user) {
            return res.status(404).json({ message: 'Employee or User not found.' });
        }

        // Add user to employee's contacts
        if (!employee.usersInContact) {
            employee.usersInContact = [];
        }
        employee.usersInContact.push(user);

        // Save the updated employee
        await employeeRepository.save(employee);

        // Send success response
        return res.status(200).json({ message: 'User added to employee contacts successfully.' });
    } catch (error) {
        console.error(error)
        // Handle possible errors
        return res.status(500).json({ message: 'Internal server error', error });
    }
}
