"use client";

import { auth } from "@/auth";
import prisma from "@/lib/db";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, Suspense, useEffect, useState } from "react";
import CourseCard from "./course-card";
import {
  getAllCourses,
  getCoursebyQueryAndCategory,
  getCoursesbyCategory,
  getCoursesbyQuery,
  typeSearchQuery,
} from "@/actions/getCourse";
import { getUserProgress } from "@/actions/getProgress";
import { useSession } from "next-auth/react";
import { SkeletonCard } from "@/components/skeletonCard";

interface courseListProps extends typeSearchQuery {
  progressPercentage?: number;
  noOfChapters?: number;
}


const CourseList = ({}) => {
  const searchParams = useSearchParams();
  const [courses, setcourses] = useState<courseListProps[]>([]);
  const [loading,setloading] = useState<boolean>(false);

  const { data: session } = useSession();

  const title = searchParams.get("title");
  const categoryId = Number(searchParams.get("categoryId"));
  
  useEffect(() => {
    (async () => {
      if(!session?.user) return 
        try {
          setloading(true)
          if (!title && !categoryId) {
            const _courses = await getAllCourses(session!.user!.id!);
            const courseList = await Promise.all(_courses.map(async (course) => {
              const progress = await getUserProgress(session.user!.id!, course.id);
              if (progress) {
                return {
                  title: course.title,
                  name: course.user!.name,
                  id: course.id,
                  description: course.description,
                  image: course.image,
                  categorytitle: course.category?.title,
                  price: course.price,
                  categoryid: course.category!.id,
                  noOfChapters: progress.noOfChapters,
                  progressPercentage: progress.progressPercentage,
                };
              } else {
                return {
                  title: course.title,
                  name: course.user!.name,
                  id: course.id,
                  description: course.description,
                  image: course.image,
                  categorytitle: course.category?.title,
                  price: course.price,
                  categoryid: course.category!.id,
                 
                };
              }
            }))
    
            setcourses(courseList as courseListProps[])
          }else if(title && !categoryId){
            const _courses = await getCoursesbyQuery(title);
            const courseList = await Promise.all(_courses.map(async(course)=>{
              const progress = await getUserProgress(session.user!.id!,course.id);
              if(progress){
                return {
                  ...course,
                  noOfChapters:progress.noOfChapters,
                  progressPercentage:progress.progressPercentage
                }
              }else{
                return {...course}
              }
            }))
            setcourses(courseList as courseListProps[])
          }else if(!title && categoryId){
            const _courses = await getCoursesbyCategory(categoryId);
            const courseList = await Promise.all(_courses.map(async(course)=>{
              const progress = await getUserProgress(session.user!.id!,course.id);
              if(progress){
                return {
                   title: course.title,
                  name: course.user!.name,
                  id: course.id,
                  description: course.description,
                  image: course.image,
                  categorytitle: course.category?.title,
                  price: course.price,
                  categoryid: course.category!.id,
                  noOfChapters:progress.noOfChapters,
                  progressPercentage:progress.progressPercentage
                }
              }else{
                return {...course}
              }
            }))
            setcourses(courseList as courseListProps[])
          }else{
            const _courses = await getCoursebyQueryAndCategory(title!,categoryId);
            const courseList = await Promise.all(_courses.map(async(course)=>{
              const progress = await getUserProgress(session.user!.id!,course.id);
              if(progress){
                return {
                  title: course.title,
                  name: course.name,
                  id: course.id,
                  description: course.description,
                  image: course.image,
                  categorytitle: course.categorytitle,
                  price: course.price,
                  categoryid: course.categoryid,
                  noOfChapters:progress.noOfChapters,
                  progressPercentage:progress.progressPercentage
                }
              }else{
                return {...course}
              }
            }))
            setcourses(courseList as courseListProps[])
          }
        } catch (error) {
          console.log(error)
        }finally {
          setloading(false)
        }
     
    })();

  }, [title, categoryId, session]); 
  
  return (
    <div className=" grid grid-flow-row sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading ? <SkeletonCard /> : courses.length === 0 ?<p className=" text-muted-foreground text-center p-8">No Courses Found</p>: courses.map((course) => {
        return (
          <CourseCard
            categorytitle={course.categorytitle}
            image={course.image}
            title={course.title}
            key={course.id}
            price={course.price || undefined}
            noOfChapters={course.noOfChapters}
            progressPercentage={course.progressPercentage}
            authorname={course.name}
            id={course.id}
          />
        );
      })}
    </div>
  );
};

export default CourseList;
