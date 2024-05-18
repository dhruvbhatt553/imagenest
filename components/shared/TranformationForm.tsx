"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  aspectRatioOptions,
  creditFee,
  defaultValues,
  transformationTypes,
} from "@/constants";
import { CustomField } from "./CustomField";
import { startTransition, useEffect, useState, useTransition } from "react";
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils";
import { updateCredits } from "@/lib/actions/user.actions";
import MediaUploader from "./MediaUploader";
import TransformedImage from "./TransformedImage";
import { getCldImageUrl } from "next-cloudinary";
import { addImage, updateImage } from "@/lib/actions/image.actions";
import { useRouter } from "next/navigation";
import { InsufficientCredits } from "./InsufficientCredits";


export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
});
const TranformationForm = ({
  action,
  data = null,
  userId,
  type,
  creditBalance,
  config = null,
}: TransformationFormProps) => {
  const transfromationType = transformationTypes[type];
  const [image, setImage] = useState(data);
  const [newTransformation, setNewTransformation] =
    useState<Transformations | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationConfig, setTransformationConfig] = useState(config);
  const [isPending, setIsPending] = useTransition();
  const router = useRouter();
  const initialValues =
    data && action === "Update"
      ? {
          title: data?.title,
          aspectRatio: data?.aspectRatio,
          color: data?.color,
          prompt: data?.prompt,
          publicId: data?.publicId,
        }
      : defaultValues;
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsSubmitting(true);
    if (data || image) {
      const transformationUrl = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...transformationConfig,
      });
      const imageData = {
        title: values.title,
        publicId: image?.publicId,
        transformationType: type,
        secureURL: image?.secureURL,
        width: image?.width,
        height: image?.height,
        config: transformationConfig,
        transformationURL: transformationUrl,
        aspectRatio: values.aspectRatio,
        color: values.color,
        prompt: values.prompt,
      };

      if(action==="Add") {
        try {
          const newImage = await addImage({image: imageData, userId, path:"/" })
          console.log("new image",newImage,{...newImage});
          
          if(newImage) {
            form.reset();
            setImage(data);
            router.push(`/transformations/${newImage._id}`);
          }
        }
        catch(error) {
          console.log("Error in ADD",error);
        }
      }

      if(action==="Update") {
        try {
          const updatedImage = await updateImage({image: {...imageData, _id: data._id}, userId, path:`/transformations/${data._id}` })
          if(updatedImage) {
            router.push(`/transformations/${updatedImage._id}`);
          }
        }
        catch(error) {
          console.log("Error in ADD",error);
        }
      }
    }
    setIsSubmitting(false);
  }
  const onSelectFieldHandler = (
    value: string,
    onChangeField: (value: string) => void
  ) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey];
    setImage((prevState: any) => ({
      ...prevState,
      aspectRation: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height,
    }));
    setNewTransformation(transfromationType.config);
    return onChangeField(value);
  };
  const onInputChangeHandler = (
    fieldName: string,
    value: string,
    type: string,
    onChangeField: (value: string) => void
  ) => {
    debounce(() => {
      setNewTransformation((prevState: any) => ({
        ...prevState,
        [type]: {
          ...prevState?.[type],
          [fieldName === "prompt" ? "prompt" : "to"]: value,
        },
      }));
      return onChangeField(value);
    }, 1000);
  };
  const onTransformHandler = async () => {
    setIsTransforming(true);
    setTransformationConfig(
      deepMergeObjects(newTransformation, transformationConfig)
    );
    setNewTransformation(null);
    startTransition(async () => {
      // Set creditFee value
      await updateCredits(userId, creditFee);
    });
  };

  useEffect(()=>{
    if((image && (type === "restore" || type === "removeBackground" )))
      {setNewTransformation(transfromationType.config)}

  },[image, transfromationType.config, type])


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'>
          {creditBalance < Math.abs(creditFee) && <InsufficientCredits/>}
        <CustomField
          control={form.control}
          formLabel='Image Title'
          className='w-full'
          name='title'
          render={({ field }) => (
            <Input
              {...field}
              className='input-field'
            />
          )}
        />
        {type === "fill" && (
          <CustomField
            control={form.control}
            name='aspectRatio'
            formLabel='Aspect Ration'
            className='w-full'
            render={({ field }) => (
              <Select
                onValueChange={(value) =>
                  onSelectFieldHandler(value, field.onChange)
                }>
                <SelectTrigger className='w-[180px] select-field'>
                  <SelectValue placeholder='Select Size' />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem
                      key={key}
                      value={key}
                      className='select-item'>
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}
        {(type === "remove" || type === "recolor") && (
          <div className='prompt-field'>
            <CustomField
              control={form.control}
              name='prompt'
              formLabel={"Object to " + type}
              className='w-full'
              render={({ field }) => (
                <Input
                  value={field.value}
                  className='input-field'
                  onChange={(e) =>
                    onInputChangeHandler(
                      "prompt",
                      e.target.value,
                      type,
                      field.onChange
                    )
                  }
                />
              )}
            />
          </div>
        )}
        {type === "recolor" && (
          <CustomField
            control={form.control}
            name='color'
            formLabel='Replacement Color'
            className='w-full'
            render={({ field }) => (
              <Input
                value={field.value}
                className='input-field'
                onChange={(e) =>
                  onInputChangeHandler(
                    "color",
                    e.target.value,
                    type,
                    field.onChange
                  )
                }
              />
            )}
          />
        )}
        <div className='media-uploader-field'>
          <CustomField
            control={form.control}
            name='publicId'
            className='flex-col size-full'
            render={({ field }) => (
              <MediaUploader
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                image={image}
                type={type}
              />
            )}
          />
          <TransformedImage
            image={image}
            title={form.getValues().title}
            type={type}
            isTransforming={isTransforming}
            setIsTransforming={setIsTransforming}
            transformationConfig={transformationConfig}
          />
        </div>
        <div className='flex flex-col gap-4'>
          <Button
            type='button'
            className='submit-button capitalize'
            disabled={isTransforming || newTransformation === null}
            onClick={onTransformHandler}>
            {isTransforming ? "Tranforming.." : "Apply Transformations"}
          </Button>
          <Button
            type='submit'
            className='submit-button capitalize'
            disabled={isSubmitting}>
            {isTransforming ? "Submitting... " : "Save Image"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default TranformationForm;
