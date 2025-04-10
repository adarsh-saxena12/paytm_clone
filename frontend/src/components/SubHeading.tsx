
interface labelType {
    label: string
}

const SubHeading = ({label}: labelType) => {
    return (
        <div className="text-slate-500 text-md pt-1 px-4 pb-4">
            {label}
        </div>
    );
};

export default SubHeading;