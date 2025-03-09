import { z } from 'zod';


export const registerSchema = z.object(
  {
    name: z.string(
      {
        required_error: 'El nombre es obligatorio',
      }
    ),
    username: z.string(
      {
        required_error: 'El username es obligatorio',
      }
    ),
    email: z.string(
      {
        required_error: 'El email es obligatorio',
      }
    ).email(
      {
        message: 'Email inválido'
      }
    ),
    password: z.string(
      {
        required_error: 'El password es requerido'
      }
    ).min(6, 
      {
        message: 'El password debe contener al menos 6 caracteres'
      }
    )
  }
)

export const loginSchema = z.object(
  {
    email: z.string(
      {
        required_error: 'El email es obligatorio',
      }
    ).email(
      {
        message: 'Email inválido'
      }
    ),
    password: z.string(
      {
        required_error: 'El password es requerido'
      }
    ).min(6, 
      {
        message: 'El password debe contener al menos 6 caracteres'
      }
    )
  }
)