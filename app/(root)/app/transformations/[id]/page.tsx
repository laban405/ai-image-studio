import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import Header from "@/components/shared/Header";
import TransformedImage from "@/components/shared/TransformedImage";
import { Button } from "@/components/ui/button";
import { getImageById } from "@/lib/actions/image.actions";
import { getImageSize } from "@/lib/utils";
import { DeleteConfirmation } from "@/components/shared/DeleteConfirmation";

const ImageDetails = async ({ params: { id } }: SearchParamProps) => {
  const { userId } = auth();

  const image = await getImageById(id);

  return (
    <>
      <Header title={image.title} />

      <section className="mt-5 flex flex-wrap gap-4">
        <div className="p-14-medium md:p-16-medium flex gap-2">
          <p className="">Transformation:</p>
          <p className=" capitalize">{image.transformationType}</p>
        </div>

        {image.prompt && (
          <>
            <p className="hidden md:block">&#x25CF;</p>
            <div className="p-14-medium md:p-16-medium flex gap-2 ">
              <p className="">Prompt:</p>
              <p className=" capitalize ">{image.prompt}</p>
            </div>
          </>
        )}

        {image.color && (
          <>
            <p className="hidden  md:block">&#x25CF;</p>
            <div className="p-14-medium md:p-16-medium flex gap-2">
              <p className="">Color:</p>
              <p className=" capitalize ">{image.color}</p>
            </div>
          </>
        )}

        {image.aspectRatio && (
          <>
            <p className="hidden md:block">&#x25CF;</p>
            <div className="p-14-medium md:p-16-medium flex gap-2">
              <p className="">Aspect Ratio:</p>
              <p className=" capitalize ">{image.aspectRatio}</p>
            </div>
          </>
        )}
      </section>

      <section className="mt-10 ">
      
          {/* MEDIA UPLOADER */}
          <div className="flex gap-3">
            <div className="grow-[2] bg-white dark:bg-background rounded-lg overflow-hidden p-4 shadow flex gap-8">
              <div className="flex flex-col gap-4 grow-[1]">
                <h3 className="h3-bold h-[30px]">Original</h3>
                <Image
                  width={getImageSize(image.transformationType, image, "width")}
                  height={getImageSize(
                    image.transformationType,
                    image,
                    "height"
                  )}
                  src={image.secureURL}
                  alt="image"
                  className="transformation-original_image"
                />
              </div>

              {/* TRANSFORMED IMAGE */}
              <div className="grow-[1]">
              <TransformedImage
                image={image}
                type={image.transformationType}
                title={image.title}
                isTransforming={false}
                transformationConfig={image.config}
                hasDownload={true}
              /></div>
            </div>
            <div className="grow-[1] bg-white dark:bg-background rounded-lg overflow-hidden p-4 shadow">
              {userId === image.author.clerkId && (
                <div className="mt-4 space-y-4">
                  <Button
                    asChild
                    type="button"
                    className="submit-button capitalize"
                  >
                    <Link href={`/app/transformations/${image._id}/update`}>
                      Update Image
                    </Link>
                  </Button>

                  <DeleteConfirmation imageId={image._id} />
                </div>
              )}
            </div>{" "}
          </div>
       
      </section>
    </>
  );
};

export default ImageDetails;
