import stringToColor from "@/lib/stringToColor";
import { motion, AnimatePresence, useMotionValue } from "framer-motion"


export default function FollowPointer(
    {
        x,
        y,
        info
    }: {
        x: number;
        y: number;
        info: {
            name: string;
            email: string;
            avatar: string;
        }
    }
) {
    const color = stringToColor(info.email || '1')
    return (
        <motion.div
            className="h-4 w-4 rounded-full absolute z-50"
            style={{
                top: y,
                left: x,
                pointerEvents: 'none',
            }}
            initial={{
                scale: 1,
                opacity: 1,
            }}
            animate={{
                scale: 1,
                opacity: 1,
            }}
            exit={{
                scale: 0,
                opacity: 0,
            }}

        >
            {/* this a cursor svg inside the motion dev */}
            <svg xmlns="http://www.w3.org/2000/svg" fill={color} viewBox="0 0 24 24" strokeWidth="1.5" stroke={color} className={`h-6 text-[${color}] transform rotate-[70deg] -translate-x-[12px] -translate-y-[10px] stroke-[${color}] rotate-0 `}>
              
<path fill={color} d="M54.68,29,14.18,12.9a1,1,0,0,0-1.3,1.3L29,54.7a1,1,0,0,0,1.79.14l6.73-11.39a1,1,0,0,1,1.57-.2L52.39,56.59a2,2,0,0,0,2.83,0l1.41-1.41a2,2,0,0,0,0-2.83L43.29,39a1,1,0,0,1,.2-1.57l11.33-6.68A1,1,0,0,0,54.68,29Z"></path>
<path fill={color} d="M14.1 17.27l38 15.09 2.7-1.59A1 1 0 0 0 54.68 29L14.18 12.9a1 1 0 0 0-1.3 1.3zM56.63 52.35L44.52 40.25h0A2.83 2.83 0 0 0 44 44.68L55.54 56.27l1.09-1.09A2 2 0 0 0 56.63 52.35z"></path>
<path fill={color} d="M57.34,51.64,44,38.31l11.33-6.68A2,2,0,0,0,55,28L14.55,12a2,2,0,0,0-2.6,2.6L28,55.07a2,2,0,0,0,3.58.28L38.34,44,51.68,57.3a3,3,0,0,0,4.24,0l1.42-1.41A3,3,0,0,0,57.34,51.64Zm-1.41,2.83-1.42,1.41a1,1,0,0,1-1.41,0L39.75,42.54A2,2,0,0,0,38.34,42l-.26,0a2,2,0,0,0-1.47,1L29.88,54.33,13.81,13.83,54.31,29.9,43,36.58a2,2,0,0,0-.4,3.14L55.92,53.06A1,1,0,0,1,55.92,54.47Z"></path>
<path fill={color} d="M44 30.11a1 1 0 0 0 .37-1.93l-14.7-5.83a1 1 0 1 0-.74 1.86L43.59 30A1 1 0 0 0 44 30.11zM25.57 20.74l-3.15-1.25a1 1 0 1 0-.74 1.86l3.15 1.25a1 1 0 1 0 .74-1.86zM8 6.72A1 1 0 0 0 6.6 8.14L8.06 9.6A1 1 0 0 0 9.48 8.19zM14.17 8.07a1 1 0 0 0 1-1V5a1 1 0 0 0-2 0V7.07A1 1 0 0 0 14.17 8.07zM7.95 14.29a1 1 0 0 0-1-1H4.87a1 1 0 0 0 0 2H6.95A1 1 0 0 0 7.95 14.29zM8.06 19L6.6 20.45A1 1 0 1 0 8 21.86L9.48 20.4A1 1 0 0 0 8.06 19zM19.56 9.89a1 1 0 0 0 .71-.29l1.47-1.47a1 1 0 0 0-1.41-1.41L18.86 8.19a1 1 0 0 0 .71 1.71z"></path>
            </svg>
            

            <motion.div
                style={{
                    backgroundColor: color
                }}
                initial={{
                    scale: 0.5,
                    opacity: 0,
                }}
                animate={{
                    scale: 1,
                    opacity: 1,
                }}
                exit={{
                    scale: 0.5,
                    opacity: 0,
                }}
                className="px-2 py-2 bg-neutral-200 text-black font-bold whitespace-nowrap text-xs rounded-full min-w-max "
            >
                    
                {info?.name || info?.email}
            </motion.div>
        </motion.div>
    )
}
