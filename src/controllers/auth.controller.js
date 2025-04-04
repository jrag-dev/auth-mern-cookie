import jwt from 'jsonwebtoken';
import User from '../models/users.model.js';
import { comparePassword, hashed } from '../libs/bcrypt.js';
import { createAccessToken } from '../libs/jsonWebToken.js';



class AuthController {

  async  register(req, res) {
    const { name, username, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      const error = new Error('Este email ya esta registrado');
      return res.status(400).json(
        {
          message: error.message,
          success: false
        }
      )
    }

    try {
      const passwordHashed = await hashed(password);
      const newUser = new User(
        {
          name,
          username,
          email,
          password: passwordHashed
        }
      )
      
      const userSaved = await newUser.save();

      const token = await createAccessToken(
        {
          id: userSaved._id
        }
      )

      res.cookie('auth_token', token, {
        expires: new Date(Date.now() + 900000),
        sameSite: "none",
        httpOnly: false,
        secure: true // Change to false en development mode
      });

      res.status(201).json(
        {
          success: true,
          message: 'User registered successfully',
          user: {
            ...userSaved._doc,
            password: undefined
          }
        }
       )
    } catch (err) {
      console.log(err)
      res.status(500).json({
        success: false,
        message: err.message
      })
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error('Todos los campos son requeridos');
      return res.status(400).json(
        {
          message: error.message,
          success: false
        }
      )
    }

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Credenciales inválidas');
      return res.status(400).json(
        {
          message: error.message,
          success: false
        }
      )
    }

    try {
      const passwordCorrect = await comparePassword(password, user.password);
      if (!passwordCorrect) {
      const error = new Error('Credenciales inválidas');
        return res.status(400).json(
          {
            message: error.message,
            success: false
          }
        )
      }

      const token = await createAccessToken(
        {
          id: user._id
        }
      )

      res.cookie('auth_token', token, {
        expires: new Date(Date.now() + 900000),
        sameSite: "none",
        httpOnly: false,
        secure: true
      });

      res.status(200).json(
        {
          success: true,
          message: 'User logged in successfully',
          user: {
            ...user._doc,
            password: undefined
          }
        }
       )
    } catch (err) {
      console.log(err)
      res.status(500).json({
        success: false,
        message: err.message
      })
    }
  }

  async logout(req, res) {
    res.cookie('auth_token', '', {
      expires: new Date(0)
    })
    return res.status(200).json(
      {
        message: 'El usuario cerro la sesión',
        success: true
      }
    );
  }

  async profile(req, res) {
    try {
      const user = await User.findById({ _id: req.user.id });
      if (!user) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json(
          {
            message: error.message,
            success: false
          }
        )
      }
      
      res.status(200).json(
        {
          message: 'Profile user',
          success: true,
          user: {
            ...user._doc,
            password: undefined
          }
        }
      )
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      })
    }
  }

  async verifyAccessToken(req, res) {
    const { auth_token } = req.cookies;

    if (!auth_token) {
      const error = new Error('Unauthorized');
      return res.status(401).json({ message: error.message, success: false })
    }

    jwt.verify(auth_token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        const error = new Error('Unauthorized');
        return res.status(401).json({ message: error.message, success: false })
      }

      const user = await User.findOne({ _id: decoded.id });
      if (!user) {
        const error = new Error('Unauthorized');
        return res.status(401).json(
          { message: error.message, success: false }
        )
      }

      return res.status(200).json(
        {
          ...user._doc,
          password: undefined
        }
      )
    })
  }

}

export default AuthController;