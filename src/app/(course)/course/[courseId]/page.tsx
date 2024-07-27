import { auth } from '@/auth'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'

async function Course({params:{courseId}}:{params:{courseId:string}}) {

  const session = await auth()
  if(!session?.user) return <p>Not authenticated</p> 

  const course = await prisma.course.findUnique({
    where:{
      id:courseId,

    },include:{
      Chapters:{
        select:{
          id:true
        },
        take:1,
        orderBy:{
          createdAt:'asc'
        }
      }
    }
  })
  if(!course) return redirect('/browse')

  return redirect(`/course/${courseId}/chapter/${course.Chapters[0].id}`) 
}

export default Course