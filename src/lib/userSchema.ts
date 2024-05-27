import { z } from "zod";

function validatePassword(val:string,ctx:z.RefinementCtx){
      const matchCaps = /[A-Z]/;
      const matchNumbers = /[0-9]/;
      const matchSymbols = /[!@#$%^&*(),.?":{}|<>/]/;

      if (!matchCaps.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must contain at least one capital letter",
        });
      }

      if (!matchNumbers.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must contain at least one number",
        });
      }

      if (!matchSymbols.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must contain at least one symbol",
        });
      }
}

export const userlogin = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(1, { message: "Password is required" }),
  
    code:z.string().refine(val=>val.length === 6 ,{message:"Code must be 6 digit"}).optional()
});

export type UserLogin = z.infer<typeof userlogin>


export const userSignUp = z.object({
    name:z.string().min(1,{message:"Name is required"}),
    email:z.string().email().min(1,{message:"Email is required"}),
    password:z.string().min(8,{message:"Password must be at least 8 characters"}).superRefine(validatePassword),
})

export type UserSignUp = z.infer<typeof userSignUp>

export const passwordReset = z.object({
  newPassword:z.string().min(8,{message:"Password must be at least 8 characters"}).superRefine(validatePassword),
  confirmPassword:z.string()
}).refine((data)=>data.newPassword === data.confirmPassword,{message:"Password does not match",path:['confirmPassword']})

export type PasswordReset = z.infer<typeof passwordReset>