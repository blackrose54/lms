import SearchBar from "@/components/searchbar";
import prisma from "@/lib/db";
import Categories from "./_components/categories";
import CourseList from "./_components/courseList";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const page = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      title: "asc",
    },
  });

  return (
    <main className="h-full w-full  p-2  space-y-4 pt-4 ">
      <div className="md:hidden  ">
        <SearchBar />
      </div>

      <Categories categories={categories} />

      <CourseList />
    </main>
  );
};

export default page;
