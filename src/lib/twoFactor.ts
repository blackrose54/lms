"use server"

import prisma from "./db";
import crypto from 'crypto'

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const token = await prisma.twoFactorToken.findFirst({
      where: {
        email,
      },
    });
    return token;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorConfirmationByUserID = async (userID: string)=>{
    try {
       return await prisma.twoFactorConfirmation.findUnique({
        where:{
            userId:userID
        }
       }) 
    } catch (error) {
       return null; 
    }

}

export const generateTwoFactorToken = async (email:string)=>{
   const token = crypto.randomInt(100_000,1_000_000).toString()
   const expires = new Date(new Date().getTime() + 1000*60*5) //5 min

   const existingtoken = await getTwoFactorTokenByEmail(email);
    if(existingtoken) {
      await prisma.twoFactorToken.delete({
        where:{
          email,
          token:existingtoken.token
        }
      })
    }

    const twofactorToken = await prisma.twoFactorToken.create({
      data:{
        email,
        token,
        expires
      }
    })

    return twofactorToken;
}
