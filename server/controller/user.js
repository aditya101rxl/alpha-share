import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import { getOTP, encrypt, compare } from '../functions/user.js'
import Post from '../models/post.js';
import _env from 'dotenv';
_env.config()

export const verifyEmail = async (req, res) => {
    const targetEmail = req.body.email;

    let otp = await getOTP(targetEmail);
    if (otp == -1) {
        res.status(400).json({});
    } else if (otp == 0) {
        res.send({ message: "Invalid email." });
    } else {
        res.send({ message: `OTP sent! Check your mail`, otp: otp })
    }
}

export const forgetPass = async (req, res) => {
    const username = req.body.username
    const { email } = await User.findOne({ username }).select({ email: 1 });
    console.log(email);
    let otp = await getOTP(email);
    console.log('otp ' + otp);
    if (otp == -1) {
        res.status(400).json({});
    } else if (otp == 0) {
        res.send({ message: "Something going wrong" });
    } else {
        res.send({ message: "Check your mail box", otp: otp })
    }
}

export const setNewPassword = async (req, res) => {
    const { username, password } = req.body;
    const hashed_password = encrypt(password);
    await User.findOneAndUpdate({ username }, { $set: { password: hashed_password } });
    res.send({ message: 'password successfully saved' })
}

export const signin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (!existingUser) return res.send({ message: "User doesn't exist" })
        if (!compare(password, existingUser.password)) return res.send({ message: "Invalid credentials." })
        const token = jwt.sign({ username: existingUser.username, id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: '168h' })
        existingUser.password = null;
        return res.send({ user: existingUser, token, message: `Welcome ${existingUser.username}` });
    } catch (error) {
        return res.status(404).send({});
    }
}

export const signup = async (req, res) => {
    const { username, lastname, firstname, email, password, confirmPassword } = req.body;
    try {
        const existingUser = await User.findOne({ username }, 'username');
        if (existingUser) return res.send({ message: 'User already exist with given username.' });
        if (password !== confirmPassword) return res.send({ message: "password don't match" });
        const hashed_password = encrypt(password);
        const newUser = await User.create({ username, name: `${firstname} ${lastname}`, email, password : hashed_password });
        const token = jwt.sign({ username: newUser.username, id: newUser._id }, process.env.SECRET_KEY, { expiresIn: '7h' })
        newUser.password = null;
        return res.send({ user: newUser, token, message: `Welcome ${newUser.username}` });
    } catch (error) {
        return res.send({ message: "something went wrong." });
    }
}

export const findUser = async (req, res) => {
    const username = req.params.username;
    try {
        const user = await User.findOne({ username }).select({ password: false });
        const post = await Post.aggregate([{ $match: { username: username } }]);
        post.reverse();
        return res.send({ user, post });
    } catch (error) {
        return res.send({ message: "user doesn't exist." });
    }
}

export const updateProfile = async (req, res) => {
    const { id } = req.params;
    const { name, email, status, profilePicture } = req.body;
    try {
        const user = await User.findByIdAndUpdate(id, { name, email, status, profilePicture }, { new: true })
        res.send(user);
    } catch (error) {
        console.log(error);
    }
}

export const searchQuery = async (req, res) => {
    const { query } = req.params;
    const allUsers = await User.find().select({ username: 1, name: 1, profilePicture: 1 });
    const regex = new RegExp(query, 'i')
    var result = []
    allUsers.forEach(element => {
        if (regex.test(element.username) || regex.test(element.name))
            result.push(element);
    });
    res.send(result);
}

export const clearNotice = async (req, res) => {
    const { username } = req.params;
    await User.findOneAndUpdate({ username }, { $set: { notificationCount: 0 } });
}