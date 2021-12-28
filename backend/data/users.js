import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync("123456", 10),
        isAdmin: true
    },
    {
        name: 'Emmanuel Rapoo',
        email: 'rapoo@example.com',
        password: bcrypt.hashSync("123456", 10),
    },
    {
        name: 'Light Bro',
        email: 'light@example.com',
        password: bcrypt.hashSync("123456", 10),
    },
]

export default users