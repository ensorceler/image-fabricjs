"use client";

import {Card, CardContent, CardFooter, CardHeader} from "@/ui/card";
import {Button} from "@/ui/button";
import {useRouter} from "next/navigation";
import {images} from "@/app/global-store";
import NextImage from 'next/image';
//import {images} from "api/route.ts";

export default function Home() {
    const router = useRouter();

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="mt-16 flex flex-wrap gap-8 items-center">
                {images.map((img) => (
                    <Card key={img.id}>
                        <CardHeader><p className="text-xl font-semibold">{img?.title}</p></CardHeader>
                        <CardContent>
                            <div className="rounded-md">
                                <NextImage src={`/${img.src}`}
                                           alt={"Image golf"}
                                           height={180}
                                           width={220}
                                           className="h-100 w-100 rounded-md"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="default" onClick={() => {
                                router.push(`/fabric/${img.id}`)
                            }}>Customize</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </main>
    )
        ;
}
