
interface labelType {
    label: string
}

const Heading = ({label}:labelType) => {
    return (
        <div className="font-bold text-4xl pt-6">
            {label}
        </div>
    );
};

export default Heading;