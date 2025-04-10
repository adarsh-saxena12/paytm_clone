import {Link} from "react-router-dom";
interface warningType{
   to:string,
   buttonText: string,
   label: string,
}
const BottomWarning = ({to,buttonText, label}:warningType) => {
    return (
        <div className="py-2 text-sm flex justify-center">
            <div>
                {label}
            </div>
            <Link
            className="pointer underline pl-1 cursor-pointer"
            to={to}
            >
            {buttonText}
            </Link>
        </div>
    );
};

export default BottomWarning;