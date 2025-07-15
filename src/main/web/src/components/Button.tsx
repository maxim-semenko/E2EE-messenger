import React from "react";
import {Button as ChakraButton, type ButtonProps as ChakraButtonProps, Spinner,} from "@chakra-ui/react";

interface CustomButtonProps extends Omit<ChakraButtonProps, "variant"> {
    isLoading?: boolean;
    colorVariant?: "primary" | "secondary" | "danger";
}

export const Button: React.FC<CustomButtonProps> = ({
                                                        children,
                                                        isLoading = false,
                                                        colorVariant = "primary",
                                                        disabled,
                                                        ...rest
                                                    }) => {
    const commonStyles = {
        borderRadius: "8px",
        border: "1px solid transparent",
        padding: "0.6em 1.2em",
        fontSize: "1em",
        fontWeight: 500,
        fontFamily: "inherit",
        cursor: "pointer",
        transition: "border-color 0.25s",
        _focus: {
            outline: "4px auto -webkit-focus-ring-color",
        },
    };

    const variantStyles = {
        primary: {
            bg: "#1a1a1a",
            color: "white",
            _hover: {borderColor: "#646cff"},
        },
        secondary: {
            bg: "gray.100",
            color: "black",
            _hover: {borderColor: "#646cff"},
        },
        danger: {
            bg: "red.500",
            color: "white",
            _hover: {borderColor: "#646cff"},
        },
    };

    return (
        <ChakraButton
            {...rest}
            disabled={isLoading || disabled}
            {...commonStyles}
            {...variantStyles[colorVariant]}
        >
            {isLoading && <Spinner size="sm" mr={2}/>}
            {children}
        </ChakraButton>
    );
};
