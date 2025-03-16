import jwt from 'jsonwebtoken';


export const isAuthRequired = (req, res, next) => {

  const auth_token = req.headers.cookie && req.headers.cookie.split('=')[1];
  console.log(auth_token)
  if (!auth_token) {
    const error = new Error('Token de acceso no enviado');
    return res.status(401).json(
       {
        message: error.message,
        success: false
       }
    )
  }

  jwt.verify(auth_token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json(
      {
        message: 'Token inválido',
        success: false
      }
    )
    req.user = decoded
    next();
  })
}