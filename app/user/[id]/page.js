import ProfileCard from "@/components/ProfileCard";

export default async function thisUser({ params })  {
  const {id} = await params;

  return (
    <div>
        <ProfileCard userID={id}/>
    </div>
  );
};

