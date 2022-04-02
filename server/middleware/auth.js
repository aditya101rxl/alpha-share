import jwt from 'jsonwebtoken';
import _env from 'dotenv'
_env.config();

export const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedData = jwt.verify(token, process.env.SECRET_KEY)
        req.userId = decodedData?.id;
        next()
    } catch (error) {
        res.send({ message: 'your jwt has expired Login again' });
        console.log(error);
    }
}