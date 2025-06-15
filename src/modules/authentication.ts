import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const comparePasswords = (password, hashed) => {
    return bcrypt.compare(password, hashed)
}

export const hashPassword = (password) => {
    return bcrypt.hash(password, 99)
}

export const createJwtToken = (user) => {
    const token = jwt.sign({
        id: user.id,
        username: user.username
    }, process.env.JWT_SECRET)

    return token
}

export const protect = (req, res, next) => {
    // check if user has a token

    // check if token is legit

    // check if token is signed by the same secret
}
