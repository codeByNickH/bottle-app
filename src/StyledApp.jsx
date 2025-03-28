import { useState, Suspense, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { Card, CardContent } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { BottleModel } from "./components/bottle-model"
import { LabelCanvas } from "./components/label-canvas"

export default function WineBottleCustomizer() {
    const [frontLabelImg, setFrontLabelImg] = useState(null)
    const [backLabelImg, setBackLabelImg] = useState(null)
    const [activeTab, setActiveTab] = useState("create")
    const [labelTab, setLabelTab] = useState("front")
    const [isLoading, setIsLoading] = useState(true)
    const [modelError, setModelError] = useState(null)
    const [modelType, setModelType] = useState("wine")

    // Check if model file exists
    useEffect(() => {
        const checkModelFile = async () => {
            try {
                const wineResponse = await fetch("/bottle-app/models/wine.gltf")
                const whiskeyResponse = await fetch("/bottle-app/models/whiskey.gltf")

                if (!wineResponse.ok || !whiskeyResponse.ok) {
                    throw new Error(`Model files not found: Wine (${wineResponse.status}), Whiskey (${whiskeyResponse.status})`)
                }
                setIsLoading(false)
            } catch (error) {
                setModelError(error instanceof Error ? error.message : "Failed to load model")
                setIsLoading(false)
                console.error("Error loading model:", error)
            }
        }

        checkModelFile()
    }, [])

    return (
        <div className="flex flex-col min-h-screen bgc">
            <header className="border-b bg-white dark:bg-slate-950 py-4 px-6 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bottle Label Customizer</h1>
            </header>

            <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 grid md:grid-cols-[1fr_400px] gap-6 bgImage">
                {/* 3D Bottle Preview */}
                <Card className="h-[500px] md:h-auto shadow-xl">
                    <CardContent className="p-0 h-full">
                        {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
    {/* Add Skeleton*/}         <p className="text-slate-500">Laddar 3D modell...</p>
                            </div>
                        ) : modelError ? (
                            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                                <div className="space-y-2">
                                    <p className="text-red-500">Error loading 3D model</p>
                                    <p className="text-sm text-muted-foreground">{modelError}</p>
                                </div>
                            </div>
                        ) : (
                            <Canvas className="bottleCard" camera={{ position: [0, 0, 4] }} gl={{ alpha: true, antialias: true }}>
                                <ambientLight intensity={1.5} />
                                <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1.5} />
                                <directionalLight position={[-10, 5, -10]} intensity={1} />
                                <hemisphereLight intensity={0.5} />
                                <Suspense fallback={null}>
                                    <BottleModel
                                        frontLabelImg={frontLabelImg}
                                        backLabelImg={backLabelImg}
                                        modelType={modelType}
                                    />
                                </Suspense>
                                <OrbitControls />
                            </Canvas>
                        )}
                    </CardContent>
                </Card>

                {/* Customization Panel */}
                <div className="space-y-6 mt-14">
                    <Card className="">
                        <CardContent className="p-4 cardContentColor shadow-xl">
                            <h3 className="font-medium mb-3">Välj Flask Typ</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setModelType("wine")}
                                    className={`px-4 py-2 rounded border hover:bg-zinc-100 ${modelType === "wine"
                                            ? "bg-white shadow-xl"
                                            : "shadow-sm"
                                        }`}
                                >
                                    Vin Flaska
                                </button>
                                <button
                                    onClick={() => setModelType("whiskey")}
                                    className={`px-4 py-2 rounded border hover:bg-zinc-100 ${modelType === "whiskey"
                                            ? "bg-white shadow-xl"
                                            : "shadow-sm"
                                        }`}
                                >
                                    Whiskey Flaska
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 cardContentColor">
                            <TabsTrigger value="create">Skapa Etikett</TabsTrigger>
                            <TabsTrigger value="upload">Ladda Upp Bild</TabsTrigger>
                        </TabsList>

                        <TabsContent value="create" className="space-y-4 pt-4">
                            <div className="flex border rounded-lg overflow-hidden mb-4 shadow-xl cardContentColor">
                                <button
                                    onClick={() => setLabelTab("front")}
                                    className={`flex-1 border py-2 px-4 hover:bg-zinc-100 ${labelTab === "front" ? "bg-white" : ""}`}
                                >
                                    Etikett Fram
                                </button>
                                <button
                                    onClick={() => setLabelTab("back")}
                                    className={`flex-1 border py-2 px-4 hover:bg-zinc-100 ${labelTab === "back" ? "bg-white" : ""}`}
                                >
                                    Etikett Bak
                                </button>
                            </div>

                            {labelTab === "front" ? (
                                <LabelCanvas
                                    onLabelGenerated={setFrontLabelImg}
                                    initialText="Beylas Hemkoka"
                                    initialBgColor="#ffffff"
                                    initialTextColor="#003d07"
                                    modelType={modelType}
                                />
                            ) : (
                                <LabelCanvas
                                    onLabelGenerated={setBackLabelImg}
                                    initialText="Beylas Hemkoka"
                                    initialBgColor="#ffffff"
                                    initialTextColor="#003d07"
                                    modelType={modelType}
                                />
                            )}
                        </TabsContent>
                        <TabsContent value="upload" className="space-y-4 pt-4">
                        <div className="flex border rounded-lg overflow-hidden mb-4 shadow-xl cardContentColor">
                                <button
                                    onClick={() => setLabelTab("front")}
                                    className={`flex-1 py-2 px-4 hover:bg-zinc-100 ${labelTab === "front" ? "bg-white" : ""}`}
                                >
                                    Etikett Fram
                                </button>
                                <button
                                    onClick={() => setLabelTab("back")}
                                    className={`flex-1 py-2 px-4 hover:bg-zinc-100 ${labelTab === "back" ? "bg-white" : ""}`}
                                >
                                    Etikett Bak
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="back-label">Bild För Etikett</Label>
                                    <Input
                                        id="back-label"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file && file.type.match("image.*")) {
                                                const reader = new FileReader()
                                                reader.onload = (event) => {
                                                    if (event.target?.result) {
                                                        if (labelTab === "back") {
                                                            setBackLabelImg(event.target.result)
                                                        } else {
                                                            setFrontLabelImg(event.target.result)
                                                        }
                                                    }
                                                }
                                                reader.readAsDataURL(file)
                                            }
                                        }}
                                        className="cursor-pointer hover:bg-zinc-100 cardContentColor"
                                    />
                                </div>

                                {backLabelImg && (
                                    <div className="mt-4">
                                        <p className="text-sm mb-2">Din Bild:</p>
                                        <img
                                            src={labelTab === "back" ? backLabelImg : frontLabelImg}
                                            alt="Preview"
                                            className="max-w-full h-auto border rounded-md relative shadow-xl"
                                            style={{ maxHeight: "200px" }}
                                        />
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                    </Tabs>

                    <div className="p-4 rounded-lg cardContentColor shadow-md">
                        <h3 className="font-medium mb-2">Instruktioner</h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Dra för att rotera flaska</li>
                            <li>• Scrolla för att zooma in/ut</li>
                            <li>• Designa din egen etikett både fram och bak</li>
                        </ul>
                    </div>
                </div>
            </main>

            <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
                Bottle Label Customizer © {new Date().getFullYear()}
                <p className="text-xs">This work is based on "Classic wine bottle with label" (https://sketchfab.com/3d-models/classic-wine-bottle-with-label-7ce93c8c3db74d3eb6421b5579717938) by ilya.terekhin (https://sketchfab.com/ilya.terekhin) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)</p>
                <p className="text-xs">title:	RED LABEL source: https://sketchfab.com/3d-models/red-label-1193e08ad2494ebabb17c49565903fe5 author: Biankk_ (https://sketchfab.com/monica.2602.bianca)</p>
            </footer>
        </div>
    )
}