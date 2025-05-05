import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoadingSkeleton() {
    return (
        <div className="flex flex-col gap-8 py-6">
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">
                        Performance Metrics
                    </h2>
                    <Tabs defaultValue="duration" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="duration" disabled>
                                Request Duration
                            </TabsTrigger>
                            <TabsTrigger value="failed" disabled>
                                Failed Requests
                            </TabsTrigger>
                            <TabsTrigger value="requests" disabled>
                                Request Count
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="duration">
                            <Card>
                                <CardHeader>
                                    <CardTitle>HTTP Request Duration</CardTitle>
                                </CardHeader>
                                <CardContent className="h-96">
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Skeleton className="w-[95%] h-[85%]" />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">
                        Resource Usage
                    </h2>
                    <Tabs defaultValue="cpu" className="w-full">
                        <Card>
                            <CardHeader>
                                <CardTitle>Summary (Avg.)</CardTitle>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <h2 className="text-lg font-bold">
                                                CPU Usage
                                            </h2>
                                            <Skeleton className="h-4 w-16 mt-1" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h2 className="text-lg font-bold">
                                                Memory Usage
                                            </h2>
                                            <Skeleton className="h-4 w-16 mt-1" />
                                        </div>
                                    </div>
                                </CardContent>
                            </CardHeader>
                        </Card>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="cpu" disabled>CPU Usage</TabsTrigger>
                            <TabsTrigger value="ram" disabled>Memory Usage</TabsTrigger>
                        </TabsList>
                        <TabsContent value="cpu">
                            <Card>
                                <CardHeader>
                                    <CardTitle>CPU Usage</CardTitle>
                                </CardHeader>
                                <CardContent className="h-96">
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Skeleton className="w-[95%] h-[85%]" />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}