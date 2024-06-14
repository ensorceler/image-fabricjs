'use client';

import {useEffect, useState} from "react";
import {fabric} from "fabric";
import {Button} from "@/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogHeader,
    DialogClose
} from "@/ui/dialog";
import {Input} from "@/ui/input";
import {Label} from "@/ui/label";
import Image from "next/image";
import {parse} from 'file-type-mime';
import {images} from "@/app/global-store";


export default function FabricPage({params}: { params: { id: string } }) {
    const imageId = params.id;
    const [imageInfo, setImageInfo] = useState<any>();
    const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
    const [uploadedImage, setUploadedImage] = useState<{ file: any, fileURL: any, isImage: boolean }>({
        file: null,
        fileURL: null,
        isImage: false
    });
    const [imageA, setImageA] = useState<any>();
    //const [imageB, setImageB] = useState<any>();
    const [insertedText, setInsertedText] = useState<string>("");
    const [isTextInsterted, setIsTextInsterted] = useState<boolean>(false);
    //const [is]

    const getImageInfo = async () => {
        setImageInfo(images[parseInt(imageId, 10) - 1]);
    }

    useEffect(() => {
        //console.log("image id =>", imageId);
        getImageInfo();
        const canvas = new fabric.Canvas("canvas", {
            height: 500,
            width: 500,
            backgroundColor: "lightgray",
            //preserveObjectStacking: true
            //borderRadius: 4,
        });
        setFabricCanvas(canvas);
        /*
        canvas.on('object:moving', function (event) {
            //isObjectMoving = true;
            console.log("event =>", event);
        })
        ;
         */
        return () => {
            canvas.dispose();
        };
    }, []);

    useEffect(() => {
        if (fabricCanvas) {
            addImage();
        }
    }, [fabricCanvas])

    const addImage = () => {

        fabric.Image.fromURL(`/${imageInfo.src}`, (img) => {
                img.scaleToHeight(500);
                img.scaleToWidth(500);
                img.selectable = false;

                fabricCanvas?.add(img)
                //@ts-ignore
                fabricCanvas.overlayImage = img;
                fabricCanvas?.renderAll()
                setImageA(img);

                /*
                fabric.Image.fromURL(`/${imageInfo.clipPathSrc}`, (movableImg: any) => {
                    img.scaleToHeight(540);
                    img.scaleToWidth(540);
                    movableImg.selectable = true;
                    movableImg.set({
                        backgroundColor: "green"
                    })
                    fabricCanvas?.add(movableImg)
                    fabricCanvas?.renderAll();
                })

                fabric.loadSVGFromURL(`/${imageInfo.clipPathSrc}`, (object: any, options) => {

                    const ellipsePath = new fabric.Path(object?.[0]?.d, {
                        backgroundColor: "black",
                        originX: "center",
                        originY: "center",
                        top: imageInfo?.clipPathOptions?.top ?? 0,
                        left: imageInfo?.clipPathOptions?.left ?? 0,
                        selectable: true,
                    });
                    ellipsePath.inverted = true;
                    img.clipPath = ellipsePath;
                    fabricCanvas?.renderAll();
                })
            */
            },
            {crossOrigin: ""})

    }


    const handleFileInputChange = async (event: any) => {
        try {
            const file = event.target.files[0];
            const types = ["jpeg", "png", "jpg"];
            const buffer = await file.arrayBuffer();
            const result = parse(buffer);
            console.log("MIME_TYPE", result);
            if (types.includes(result?.ext!)) {
                const cachedURL = URL.createObjectURL(file);
                setUploadedImage({
                    file: file,
                    fileURL: cachedURL,
                    isImage: true
                });
            } else {
                setUploadedImage({
                    file: null,
                    fileURL: null,
                    isImage: false
                });
            }
        } catch (err: any) {
            console.error("Error: ", err.message);
        }
    }

    const onOpenChangeUploadDialog = (open: boolean) => {

        if (uploadedImage.fileURL && !open) {
            /*
            if (isTextInsterted) {

                fabric?.loadSVGFromURL(`/${imageInfo?.textClipPathSrc}`, (object: any) => {
                    //imageA
                    //imageA.clipPath=object
                    const textEllipsePath = new fabric.Path(object?.[0]?.d, {
                        backgroundColor: "#000",
                        originX: "center",
                        originY: "center",
                        top: imageInfo?.insertedTextOptions?.top ?? 100,
                        left: imageInfo?.insertedTextOptions?.left ?? 0,
                        selectable: true,
                    });
                    textEllipsePath.inverted = true;
                    //console.log("textellipse path=>",)
                    console.log("text/ellipse path=>",textEllipsePath);
                    imageA.clipPath = textEllipsePath;
                    fabricCanvas?.renderAll();
                })
            }

             */
            // add the clip to base image
            fabric.loadSVGFromURL(`/${imageInfo.clipPathSrc}`, (object: any, options) => {
                //console.log("object =>", object);
                const ellipsePath = new fabric.Path(object?.[0]?.d, {
                    backgroundColor: "green",
                    originX: "center",
                    originY: "center",
                    top: imageInfo?.clipPathOptions?.top ?? 0,
                    left: imageInfo?.clipPathOptions?.left ?? 0,
                    selectable: true,
                });
                ellipsePath.inverted = true;
                imageA.clipPath = ellipsePath;
                console.log("ellipse path =>",ellipsePath);
                fabricCanvas?.renderAll();
            })

            // load the uploaded image in the background
            fabric.Image.fromURL(uploadedImage.fileURL, (imageB) => {
                if (imageInfo?.uploadedImageOptions?.scaleToSize) {
                    imageB.scaleToWidth(imageInfo?.uploadedImageOptions?.scaleToSize?.width);
                    imageB.scaleToHeight(imageInfo?.uploadedImageOptions?.scaleToSize?.height);
                }

                imageB.set({
                    //width: 242,
                    //height: 231,
                    originX: 'center',
                    originY: 'center',
                    top: imageInfo?.uploadedImageOptions?.options?.top ?? 100,
                    left: imageInfo?.uploadedImageOptions?.options?.left ?? 0,
                })
                imageB.selectable = true;
                fabricCanvas?.add(imageB);
            }, {crossOrigin: ""});
            //console.log("image A", imageA);


        }
    }

    const onClickDownloadCanvas = () => {

        const dataURL = fabricCanvas?.toDataURL({
            format: 'png',
        });
        const link: any = document.createElement('a');
        link.download = 'download.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div>
            <div className="max-w-5xl mx-auto my-20 flex flex-col gap-4 justify-center align-center">
                {/*<h1 className="text-xl text-red-500">Hello Fabricjs</h1>*/}
                <div className="max-w-4xl flex flex-row gap-3">
                    <div className="canvas-wrapper border flex-1">
                        <canvas id="canvas" className="w-full h-full"></canvas>
                    </div>
                    <div className="max-w-xl flex flex-col gap-3">
                        <p className="text-xl font-medium">
                            Neque porro quisquam est qui dolorem ipsum quia dolor si
                        </p>
                        <p className="text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam quis pharetra ante. Nunc sed
                            urna cursus, tristique risus quis, aliquam velit. Pellentesque cursus accumsan mauris id
                            porttitor. Suspendisse tincidunt aliquet malesuada. Donec ornare mollis risus sed imperdiet.
                            Etiam cursus urna ante, vitae fermentum nisi placerat euismod. Aenean quis pretium lacus, in
                            vehicula elit orci, in lobortis massa ultricies eget.
                        </p>
                        {/**
                         <Button variant="secondary" className="w-fit" onClick={addImage}>Set Image</Button>
                         */}

                        <div className="flex flex-col">
                            <Dialog onOpenChange={onOpenChangeUploadDialog}>
                                <DialogTrigger className="w-fit bg-black text-white px-4 py-2 rounded-md">
                                    Personalize
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Personalize Image</DialogTitle>
                                    </DialogHeader>
                                    <div>
                                        <div>
                                            <Label htmlFor="picture">Upload Picture: </Label>
                                            <Input id="picture" type="file" onChange={handleFileInputChange}/>
                                            {
                                                !uploadedImage.isImage &&
                                                <Label htmlFor="picture" className="text-red-500 text-xs">
                                                    Upload only
                                                    JPEG,JPG,PNG</Label>
                                            }
                                            {
                                                uploadedImage.fileURL &&
                                                <div className="mt-3 flex flex-col gap-2">
                                                    <p className="font-medium text-sm text-black">Uploaded Media</p>
                                                    <Image src={uploadedImage?.fileURL!} alt="Image Uploaded"
                                                           height={350} width={350}/>
                                                    <Button variant="ghost" className="w-fit" onClick={() => {
                                                        setIsTextInsterted(p => !p)
                                                    }}>
                                                        Add Text
                                                    </Button>
                                                    {isTextInsterted &&
                                                        <div>
                                                            <Input type="text"
                                                                   value={insertedText}
                                                                   onChange={(e) => {
                                                                       setInsertedText(e.target.value)
                                                                   }}/>
                                                        </div>}
                                                    <DialogClose asChild>
                                                        <Button variant="default" className="w-fit">Replace</Button>
                                                    </DialogClose>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div>
                            <Button variant="outline" onClick={onClickDownloadCanvas}>
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// @ts-ignore
/*

let zoomLevel = 0;
let zoomLevelMin = 0;
let zoomLevelMax = 3;


imageB.zoomLevel = 0
imageB.scale(1);


// @ts-ignore
imageB.zoomIn = function () {
    if (zoomLevel < zoomLevelMax) {
        zoomLevel += 0.1;
        // @ts-ignore
        imageB.zoomLevel = zoomLevel;
    }
};


// @ts-ignore
imageB.zoomOut = function () {
    zoomLevel -= 0.1;
    if (zoomLevel < 0) zoomLevel = 0;
    if (zoomLevel >= zoomLevelMin) {
        imageB.scale(zoomLevel);
        // @ts-ignore
        imageB.zoomLevel = zoomLevel;
    }
};
fabricCanvas?.renderAll();

 */
