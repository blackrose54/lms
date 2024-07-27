export async function getChapters(userId:string,courseId:string) {
    return await prisma.chapter.findMany({
        where:{
            courseId:courseId,
            userId:userId
        }
    })
    
}