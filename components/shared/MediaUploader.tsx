import React from "react";
import { useToast } from "../ui/use-toast";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { dataUrl, getImageSize } from "@/lib/utils";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  publicId: string;
  type: string;
  image: any;
};

const MediaUploader = ({
  onValueChange,
  type,
  image,
  setImage,
  publicId,
}: MediaUploaderProps) => {
  const { toast } = useToast();

  const onUploadSucessHandler = (result: any) => {


    setImage((prevState:any)=>({
      ...prevState,
      publicId:result?.info?.public_id,
      width:result?.info?.width,
      height:result?.info?.height,
      secureURL:result?.info?.secure_url,
    }))

    onValueChange(result?.info?.public_id);

    toast({
      title: "Image uploaded sucessfully",
      description: "! credit deducted from your account",
      duration: 5000,
      className: "sucess-toast",
    });
  };

  const onUploadErrorHandler = () => {
    toast({
      title: "Something went wrong while uploading image",
      description: "Try Again",
      duration: 5000,
      className: "error-toast",
    });
  };

  return (
    <CldUploadWidget
      uploadPreset='jsm_imagenest'
      options={{
        multiple: false,
        resourceType: "image",
      }}
      onSuccess={onUploadSucessHandler}
      onError={onUploadErrorHandler}>
      {({ open }) => (
        <div className='flex flex-col gap-4'>
          <h3 className='h3-bold text-dark-600'>Original</h3>

          {publicId ? (
            <>
              <div className='overflow-hidden rounded-[10px] cursor-pointer'>
                <CldImage
                  width={getImageSize(type, image, "width")}
                  height={getImageSize(type, image, "height")}
                  src={publicId}
                  alt='Image'
                  sizes={"(max-width: 767px) 100vw, 50vw"}
                  placeholder={dataUrl as PlaceholderValue}
                  className='media-uploader_cldImage'
                />
              </div>
            </>
          ) : (
            <div
              className='media-uploader_cta'
              onClick={() => open()}>
              <div className='media-uploader_cta-image'>
                <Image
                  src='/assets/icons/add.svg'
                  alt='Add Image'
                  width={24}
                  height={24}
                />
              </div>
              <p className='p-14 '> Click here to upload image</p>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
};

export default MediaUploader;
