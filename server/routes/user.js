import express from 'express';
import { signin, signup, findUser, updateProfile, searchQuery, clearNotice } from '../controller/user.js';
import { forgetPass, verifyEmail, setNewPassword } from '../controller/user.js'
import { auth } from '../middleware/auth.js';


const router = express.Router();

router.post('/getOtp', verifyEmail)
router.post('/signin', signin)
router.post('/signup', signup)

router.post('/forgetPassword', forgetPass)
router.patch('/setNewPassword', setNewPassword)

router.get('/profile/:username', findUser);
router.patch('/profile/update/:id', auth, updateProfile)

router.get('/searchQuery/:query', searchQuery)
router.patch('/clearNotice/:username', clearNotice)

export default router;