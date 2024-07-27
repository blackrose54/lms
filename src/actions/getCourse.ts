"use server";

import prisma from "@/lib/db";

export interface typeSearchQuery {
  title: string;
  description: string;
  image: string;
  name: string;
  id: string;
  categorytitle: string;
  price: number;
  categoryid:number
}
export async function getCoursesbyQuery(query: string){

  const courses: typeSearchQuery[] = Array.from(
    await prisma.$queryRaw`SELECT * FROM searchquery(${query});`
  );

  return courses;
}

export async function getCoursesbyCategory(categoryId:number){

  return await prisma.course.findMany({
    where:{
      categoryId
    },include:{
      category:{
        select:{
          title:true,
          id:true
        }
      },
      user:{
        select:{
          name:true
        }
      }
    }
  })
  
    
}

export async function getCoursebyQueryAndCategory(query:string,categoryId:number):Promise<typeSearchQuery[]>{
  return await prisma.$queryRaw`SELECT * FROM searchquery(${query}) where categoryId=${categoryId} ;`
}

export async function getAllCourses(userId:string){
  return await prisma.course.findMany({
    orderBy:{
    _relevance:{
      fields:['userId'],
      search:userId,
      sort:'asc'
    }
    },include:{
      user:{
        select:{
          name:true
        }
      },
      category:{
        select:{
          title:true,
          id:true
        }
      }
    }
  });
}


