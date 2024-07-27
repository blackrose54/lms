import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface props {
  title: string;
  price?: number;
  image: string;
  categorytitle: string;
  noOfChapters?: number;
  progressPercentage?: number;
  authorname: string;
  id:string
}
function CourseCard({
  title,
  price,
  image,
  categorytitle,
  noOfChapters,
  progressPercentage,
  authorname,
  id
}: props) {
  return (
    <Link href={`/course/${id}`}>
    <Card className="space-y-2 overflow-clip border-border hover:border-2 hover:shadow-md hover:text-primary cursor-pointer p-4 ">
      <div className="border relative aspect-video overflow-clip rounded-md">
        <Image src={image} alt="image" className=" object-cover" fill />
      </div>
      <Badge>{categorytitle}</Badge>
      <div className=" space-y-2">
        <CardTitle className="">{title}</CardTitle>
        <CardDescription className=" text-muted-foreground">
          {authorname}
        </CardDescription>
      </div>
      <div className=" space-y-2">
        <div className=" flex gap-x-2 items-center">
          <div className=" rounded-full p-2 bg-primary/30 text-primary">
            <BookOpen size={20} />
          </div>
          <p className=" text-muted-foreground">{noOfChapters} Chapters</p>
        </div>
        {!price ? (
          <div className=" space-y-2">
            <Progress value={progressPercentage} />
            <p className=" text-muted-foreground">
              {progressPercentage}% Complete
            </p>
          </div>
        ) : (
          <div className=" font-semibold text-card-foreground space-y-2">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(price)}
          </div>
        )}
      </div>
    </Card>
    </Link>
  );
}

export default CourseCard;
