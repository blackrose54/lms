
CREATE INDEX searchcoursefts ON "Course" using GIN(searchcourse);

CREATE INDEX searchnamefts ON "User" using GIN(searchname);

CREATE OR REPLACE FUNCTION SEARCHQUERY(TERM TEXT) RETURNS TABLE( 
ID TEXT,
TITLE TEXT,
DESCRIPTION TEXT,
IMAGE TEXT,
CATEGORYID INT,
NAME TEXT,
CATEGORYTITLE TEXT,
PRICE FLOAT,
RANK real
) as $$

begin

return query select 
"Course"."id",
"Course"."title",
"Course"."description",
"Course"."image",
"Course"."categoryId",
"User"."name",
"Category"."title",
"Course"."price",
ts_rank(searchcourse,websearch_to_tsquery('english',TERM)) +
ts_rank(searchcourse,websearch_to_tsquery('simple',TERM)) AS rank
from "Course"
inner join "User" on "User"."id" = "Course"."userId"
inner join "Category" on "Category"."id" = "Course"."categoryId"
where searchcourse @@ websearch_to_tsquery('english',TERM) or
searchcourse @@ websearch_to_tsquery('simple',TERM)
order by rank desc;

end;

$$ LANGUAGE plpgsql;