import {motion} from "framer-motion";
import {type ReactNode} from "react";

type Props = {
    children: ReactNode;
    duration?: number;
};

export const Animate = ({children, duration = 0.3}: Props) => (
    <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration}}
    >
        {children}
    </motion.div>
);