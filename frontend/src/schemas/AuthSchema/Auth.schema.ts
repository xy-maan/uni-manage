import { z } from "zod"
export const schema=z.object({
        name: z.string().nonempty("name is required").min(3,"least 3 char").max(10,"max 10 char"),
    email:z.email("email is required"),
    password:z.string().nonempty("email is required").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:"
),
    rePassword:z.string().nonempty("email is required").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:"
),
    plan:z.string().nonempty("email is required").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:"
),
    expertise:z.string().nonempty("email is required").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:"
),
    phone:z.string().regex(/^01[0125][0-9]{8}$/)
  }).refine((obj)=>{return obj.password===obj.rePassword},{path:["rePassword"],error:"Passwords are in-match"})
export interface planType {
  id: string
  title: string
  description?: string
  recommended?: boolean
 ta?: boolean
}
