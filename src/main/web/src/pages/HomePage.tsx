import {useState} from "react";
import {downloadKeysFile, initKeys} from "../services/keyservice.ts";
import {Button} from "../components/Button.tsx";
import {Animate} from "../components/Animate.tsx";
import {Alert, Field, FileUpload, Flex, Textarea, VStack} from "@chakra-ui/react";
import {AnimatePresence} from "framer-motion";
import {Modal} from "@/components/Modal.tsx";
import {useNavigate} from "react-router-dom";
import {type CurrentUser, useUserStore} from "@/store/userStore.ts";

function HomePage() {
    const [isGenerating, setIsGenerating] = useState(false)
    const [isImporting, setIsImporting] = useState(false)
    const [isOpenModalAfterGenerating, setIsOpenModalAfterGenerating] = useState(false);
    const [isShowPreview, setIsShowPreview] = useState(false);

    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const navigate = useNavigate();

    const generateKeys = async () => {
        if (isGenerating) return;

        setIsGenerating(true);
        try {
            const data = await initKeys();
            if (data) {
                const user: CurrentUser = {
                    id: data.userId,
                    privateKey: data.privateKey,
                    publicKey: data.publicKey
                }
                setUser(user)
                setIsOpenModalAfterGenerating(true);
            }
        } catch (e) {
            console.error(e);
        }
        setIsGenerating(false);
    };

    const importKeys = async (file: any) => {
        if (isImporting) return;

        setIsImporting(true);
        try {
            await initKeys(file);
            navigate("/chat")
        } catch (e) {
            console.error(e);
        }
        setIsImporting(false);
    };

    if (isOpenModalAfterGenerating) {
        return (
            <>
                <Modal
                    title="Generate sucess"
                    size="lg"
                    cancelText="Ok"
                    isOpen={isOpenModalAfterGenerating}
                    onClose={() => {
                        setIsOpenModalAfterGenerating(false);
                        navigate("/chat");
                    }}
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
            </>
        )
    }

    return (
        <AnimatePresence mode="wait">
            <Animate>
                <Flex
                    direction="column"
                    justify="center"
                    align="center"
                    minH="100vh"
                >

                    <h1>Hello Veil!</h1>
                    <Flex justify="center" align="center" w="100%" mt={8}>
                        <Flex gap={4}>
                            <Button
                                onClick={() => generateKeys()}
                                disabled={isGenerating || isImporting}
                                isLoading={isGenerating}
                            >
                                Generate Keys
                            </Button>

                            <FileUpload.Root accept={[".txt"]}>
                                <FileUpload.HiddenInput
                                    onChange={async (event) => {
                                        const file = event.target.files?.[0];
                                        if (file) {
                                            await importKeys(file);
                                        }
                                    }}
                                />
                                <FileUpload.Trigger asChild>
                                    <Button
                                        disabled={isImporting || isGenerating}
                                        isLoading={isImporting}
                                    >
                                        Import Keys
                                    </Button>
                                </FileUpload.Trigger>
                            </FileUpload.Root>
                        </Flex>
                    </Flex>
                </Flex>
            </Animate>
        </AnimatePresence>
    );
}

export default HomePage;