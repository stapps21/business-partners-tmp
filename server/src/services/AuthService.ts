require('module-alias/register')
import { AppDataSource } from "@config/data-source";
import { User } from "@entities/User";
import ResponseError from "../utils/ResponseError";
import { InvalidUserRoleError } from "@exceptions/InvalidUserRoleError";
import { USER_ROLES } from "@/enum/UserRoles";
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from "./EmailService";

const checkValidRoles = (roles: number[]) => {
    if (!roles.every(value => Object.values(USER_ROLES).includes(value))) {
        throw new InvalidUserRoleError("Invalid user role in array");
    }
}

export const createUserService = async (userData: Partial<User>): Promise<User> => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = userRepository.create(userData);

        checkValidRoles(user.roles)

        user.password = null
        user.active = true

        const otp = uuidv4();
        user.oneTimePassword = otp;
        user.otpExpiry = new Date(new Date().getTime() + 6 * 60 * 60 * 1000); // 6 hours from now

        const savedUser = await userRepository.save(user);

        // Send email with OTP link
        await sendOtpEmail(savedUser.mail, savedUser.firstName, otp);

        return savedUser;

        //await bcrypt.hash(userData.password, salt);

        return await userRepository.save(user);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') { // Adjust error code based on your DBMS
            throw new ResponseError(400, "Operation failed - email already in use", "COMP_CREATE_400_DUPLICATE", true);
        } else if (error instanceof InvalidUserRoleError) {
            throw new ResponseError(400, "Invalid user role", "AUTH_400_INVALID_USER_ROLE")
        }
        throw error;
    }
};

async function sendOtpEmail(email: string, firstName: string, otp: string) {
    const mailOptions = {
        to: email,
        subject: 'Welcome to Business Partners – Set Up Your Password',
        text: `Hi ${firstName},

        Welcome to Business Partners! You've been added as a user by your company's admin, and we're excited to have you on board.
        
        To get started, you'll need to set your password. This is a crucial step to ensure the security of your account and access all the features of our platform. Please use the following link to create your password:
        
        [Set Your Password](${generatePasswordResetLink(otp)})
        
        Note: This link is valid for 6 hours only for security purposes.
        
        If you encounter any issues or have any questions, please don't hesitate to reach out to our support team.
        
        We're looking forward to seeing you in the Business Partners community!
        
        Warm regards,
        The Business Partners Team`,
        html: `
        <!DOCTYPE html>
<html>
<head>
    <style>
        .email-container {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .footer {
            background-color: #f2f2f2;
            padding: 10px;
            text-align: center;
            font-size: 0.8em;
        }
        a {
            color: #4CAF50;
            text-decoration: none;
        }
        .button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-align: center;
            display: inline-block;
            margin: 10px 0;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            Welcome to Business Partners
        </div>
        <div class="content">
            <p>Hi ${firstName},</p>
            <p>Welcome to Business Partners! You've been added as a user by your company's admin, and we're excited to have you on board.</p>
            <p>To get started, you'll need to set your password. This is a crucial step to ensure the security of your account and access all the features of our platform. Please use the following link to create your password:</p>
            <a href="${generatePasswordResetLink(otp)}" class="button">Set Your Password</a>
            <p>Note: This link is valid for 6 hours only for security purposes.</p>
            <p>If you encounter any issues or have any questions, please don't hesitate to reach out to our support team.</p>
            <p>We're looking forward to seeing you in the Business Partners community!</p>
        </div>
        <div class="footer">
            Warm regards,<br>
            The Business Partners Team
        </div>
    </div>
</body>
</html>

        `
    };

    await sendEmail(mailOptions.to, mailOptions.subject, mailOptions.text, mailOptions.html)
}

function generatePasswordResetLink(otp: string) {
    // Replace with your frontend route that handles password reset
    return `http://localhost:3000/password-reset/${otp}`;
}

export const findUserByIdService = async (id: number): Promise<User | undefined> => {
    const userRepository = AppDataSource.getRepository(User);
    return await userRepository.findOne({ where: { id } });
};

export const getAllUsersService = async (): Promise<User[]> => {
    const userRepository = AppDataSource.getRepository(User);
    return await userRepository.find();
};



export const updateUserService = async (id: number, userData: Partial<User>): Promise<User> => {
    const userRepository = AppDataSource.getRepository(User);

    try {
        // Check if user exists before updating
        const existingUser = await userRepository.findOneBy({ id });
        if (!existingUser) {
            throw new Error(`User with ID ${id} not found.`);
        }

        // Update the user with the provided userData
        await userRepository.update(id, userData);

        // Fetch and return the updated user details
        const updatedUser = await findUserByIdService(id);
        if (!updatedUser) {
            throw new Error(`Failed to retrieve updated details for user with ID ${id}.`);
        }
        return updatedUser;
    } catch (error) {
        // Log the error or handle it as needed
        console.error('Error updating user:', error);
        throw new Error('Error updating user.'); // Or more specific error handling as required
    }
};



export const deleteUserService = async (id: number): Promise<void> => {
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.delete(id);
};
