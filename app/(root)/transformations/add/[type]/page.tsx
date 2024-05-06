import Header from "@/components/shared/Header";
import TranformationForm from "@/components/shared/TranformationForm";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const AddTransformationPage = async ({
  params: { type },
}: SearchParamProps) => {
  const { userId } = auth();
  const tranformation = transformationTypes[type];

  if (!userId) redirect("/sign-in");
  const user = await getUserById(userId);

  return (
    <>
      <Header
        title={tranformation.title}
        subtitle={tranformation.subTitle}
      />

      <section className='mt-10'>
        <TranformationForm
          action='Add'
          userId={user._id}
          type={tranformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  );
};

export default AddTransformationPage;
