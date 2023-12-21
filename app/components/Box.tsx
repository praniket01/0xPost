import { twMerge } from "tailwind-merge";


interface Boxprops{
    children: React.ReactNode;
    className?: string;
}

const Box: React.FC<Boxprops> = ({
    children,
    className
}) => {
    
    return(
        <div
        className= {twMerge(`
        rounded-lg
        h-fit
        w-full
        bg-white
        `,
        className
        )}
        >
            {children}
        </div>
    );
}

export default Box;