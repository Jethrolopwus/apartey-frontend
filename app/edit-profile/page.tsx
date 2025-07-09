"use client";
import EditProfile from "@/components/organisms/EditProfile";
import { useGetUserProfileQuery } from "@/Hooks/use-getuserProfile.query";
import { useUpdateProfileMutation } from "@/Hooks/use.updateProfile.mutation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function EditProfilePage() {
  const { data, isLoading, isError, error } = useGetUserProfileQuery();
  const { mutate, error: updateError, data: updateData } = useUpdateProfileMutation();
  const router = useRouter();

  useEffect(() => {
    if (updateData && updateData.message) {
      toast.success(updateData.message);
    }
  }, [updateData]);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError) return <div className="p-8 text-red-500">{(error as Error)?.message || "Error loading profile."}</div>;

  const user = data?.currentUser;

  const handleSave = (formData: unknown) => {
    console.log("Payload to send in save:", formData);
    if (formData instanceof FormData) {
      for (const pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log('FormData entry:', pair[0], pair[1].name, pair[1]);
        } else {
          console.log('FormData entry:', pair[0], pair[1]);
        }
      }
    } else {
      console.log("Payload to send in save (not FormData):", formData);
    }
    mutate(formData, {
      onSuccess: () => {
        router.push("/profile");
      },
    });
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <EditProfile
        userEmail={user?.email}
        initialData={user}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      {updateError && (
        <div className="text-red-500 text-center mt-4">{(updateError as Error)?.message || "Error updating profile."}</div>
      )}
    </div>
  );
}
