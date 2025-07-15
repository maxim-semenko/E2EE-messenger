import {useEffect, useState} from "react";
import {downloadKeysFile, initKeys} from "../services/keyservice.ts";
import {Button} from "../components/Button.tsx";
import {Animate} from "../components/Animate.tsx";
import {Alert, Field, Flex, Textarea, VStack} from "@chakra-ui/react";
import {AnimatePresence} from "framer-motion";
import {Modal} from "@/components/Modal.tsx";
import {type User, useUser} from "@/context/UserContext.ts";

function HomePage() {
    const [isGenerating, setIsGenerating] = useState(false)
    const [isImporting, setIsImporting] = useState(false)
    const [privateKey, setPrivateKey] = useState<string | null>(null);
    const [isOpenModalAfterGenerating, setIsOpenModalAfterGenerating] = useState(false);
    const [isShowPreview, setIsShowPreview] = useState(false);

    const {user, setUser} = useUser();

    useEffect(() => {
        setPrivateKey(localStorage.getItem("privateKey"))
    }, [isImporting, isGenerating]);

    const generateKeys = async () => {
        if (isGenerating) return;

        setIsGenerating(true);
        try {
            const data = await initKeys({type: "generate"});
            if (data) {
                const user: User = {
                    id: data.userId,
                    privateKey: data.privateKey,
                    publicKey: data.publicKey
                }
                setUser(user)
                setIsOpenModalAfterGenerating(true);
                console.log("success saved");
                console.log("user from context:", user);
            }
        } catch (e) {
            console.error(e);
        }
        setIsGenerating(false);
    };

    const importKeys = async () => {
        if (isImporting) return;

        setIsImporting(true);
        try {
            await initKeys({type: "import"});
            console.log("success saved");
        } catch (e) {
            console.error(e);
        }
        setIsImporting(false);
    };

    if (privateKey) {
        return (
            <AnimatePresence mode="wait">
                <Animate>
                    <div className="flex justify-center gap-4 mt-8">
                        <h1 style={{marginBottom: "20px"}}>Logged</h1>
                        <Button onClick={() => {
                            localStorage.removeItem("privateKey")
                            setPrivateKey(null);
                        }}>
                            Log out
                        </Button>
                        <h1>{user?.id}</h1>
                        <Modal
                            title="Generate sucess"
                            size="lg"
                            cancelText="Ok"
                            isOpen={isOpenModalAfterGenerating}
                            onClose={() => setIsOpenModalAfterGenerating(false)}
                            showTrigger={false}
                            showConfirm={false}
                        >
                            <Alert.Root status="warning">
                                <Alert.Indicator/>
                                <Alert.Title>
                                    Your personal keys generated only 1 times, don't lose them
                                </Alert.Title>
                            </Alert.Root>

                            <VStack w="100%" style={{marginTop: 20}}>
                                <Button
                                    w="100%"
                                    onClick={() => {
                                        setIsShowPreview(true);
                                    }}
                                >
                                    Preview keys
                                </Button>

                                <Button
                                    w="100%"
                                    onClick={() => {
                                        downloadKeysFile(user!.publicKey, user!.privateKey!, `keys-${user!.id!}`);
                                    }}
                                >
                                    Download keys
                                </Button>
                            </VStack>

                            <Modal
                                title="Your RSA pair keys"
                                size="xl"
                                isOpen={isShowPreview}
                                onClose={() => setIsShowPreview(false)}
                                cancelText="Ok"
                                showTrigger={false}
                                showConfirm={false}
                            >
                                <Field.Root>
                                    <Field.Label>
                                        User ID
                                    </Field.Label>
                                    <Textarea disabled value={user!.id} size={"lg"} autoresize/>
                                </Field.Root>

                                <Field.Root style={{marginTop: 20}}>
                                    <Field.Label>Public key</Field.Label>
                                    <Textarea disabled value={user!.publicKey} size={"lg"} autoresize maxH="20lh"/>
                                </Field.Root>

                                <Field.Root style={{marginTop: 20}}>
                                    <Field.Label>Private key</Field.Label>
                                    <Textarea disabled value={user!.privateKey} size={"lg"} autoresize maxH="20lh"/>
                                </Field.Root>
                            </Modal>
                        </Modal>
                    </div>
                </Animate>
            </AnimatePresence>
        )
    }

    return (
        <AnimatePresence mode="wait">
            <Animate>
                <h1>Hello Veil!</h1>
                <Flex justify="center" align="center" gap={4}>
                    <Button
                        onClick={() => generateKeys()}
                        disabled={isGenerating || isImporting}
                        isLoading={isGenerating}
                    >
                        Generate Keys
                    </Button>
                    <Button
                        onClick={() => importKeys()}
                        disabled={isImporting || isGenerating}
                        isLoading={isImporting}
                    >
                        Import Keys
                    </Button>
                </Flex>
            </Animate>
        </AnimatePresence>
    );
}

export default HomePage;