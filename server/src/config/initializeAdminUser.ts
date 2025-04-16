require('module-alias/register')
import { User } from "@/entities/User"
import { AppDataSource } from "./data-source"
import { USER_ROLES } from "@/enum/UserRoles"

export async function initializeAdminUser() {
    const userRepository = AppDataSource.getRepository(User)

    // Check if any user exists to determine if this is the first run
    const userCount = await userRepository.count()
    if (userCount === 0) {
        // No users exist, create the default admin user
        const adminUser = new User()
        adminUser.mail = 'admin@example.com'
        adminUser.firstName = 'Admin'
        adminUser.lastName = 'User'
        adminUser.oneTimePassword = 'admin'
        adminUser.otpExpiry = new Date(2100, 0, 1);
        adminUser.roles = [USER_ROLES.USER, USER_ROLES.ADMIN]
        adminUser.password = null
        adminUser.active = true
        adminUser.createdAt = new Date()
        adminUser.updatedAt = new Date()

        // Save the admin user to the database
        await userRepository.save(adminUser)
        console.log('Default admin user created')
        console.log('http://localhost:3000/password-reset/admin')
    }
}
