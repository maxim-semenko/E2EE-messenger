import {
    Button as ChakraButton,
    type ButtonProps,
    CloseButton,
    Dialog,
    type HTMLChakraProps,
    Portal,
} from "@chakra-ui/react";
import {type ReactNode} from "react";
import {Button} from "@/components/Button.tsx";

type DialogSize = "xs" | "sm" | "md" | "lg" | "xl" | "full" | "cover";

interface CustomDialogProps {
    title: ReactNode;
    children: ReactNode;
    size?: DialogSize;
    triggerText?: string;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    showTrigger?: boolean;
    autoOpen?: boolean;
    confirmProps?: ButtonProps;
    cancelProps?: ButtonProps;
    dialogProps?: HTMLChakraProps<"div">;
    showConfirm?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
}

export const Modal = ({
                          title,
                          children,
                          size = "md",
                          triggerText = "Open Dialog",
                          onConfirm,
                          confirmText = "Save",
                          cancelText = "Cancel",
                          showTrigger = true,
                          confirmProps,
                          cancelProps,
                          dialogProps,
                          showConfirm = true,
                          isOpen = false,
                          onClose
                      }: CustomDialogProps) => {

    return (
        <Dialog.Root
            size={size}
            role="alertdialog"
            open={isOpen}
            onOpenChange={(details) => {
                if (onClose && !details.open) onClose();
            }}
        >
            {showTrigger && (
                <Dialog.Trigger asChild>
                    <Button>{triggerText}</Button>
                </Dialog.Trigger>
            )}

            <Portal>
                <Dialog.Backdrop/>
                <Dialog.Positioner>
                    <Dialog.Content {...dialogProps}>
                        <Dialog.Header>
                            <Dialog.Title>{title}</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>{children}</Dialog.Body>

                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <ChakraButton variant="outline" {...cancelProps}>
                                    {cancelText}
                                </ChakraButton>
                            </Dialog.ActionTrigger>
                            {showConfirm && <Dialog.ActionTrigger asChild>
                                <ChakraButton
                                    onClick={() => {
                                        onConfirm?.();
                                    }}
                                    {...confirmProps}
                                >
                                    {confirmText}
                                </ChakraButton>
                            </Dialog.ActionTrigger>}
                        </Dialog.Footer>

                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm"/>
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
