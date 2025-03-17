interface InputFieldProps {
    type: string;
    placeholder?: string;
    className?: string;
    value?: string; // Add this
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Add this
}

const InputField: React.FC<InputFieldProps> = ({ type, placeholder, className, value, onChange }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className={className}
            value={value} // Controlled input
            onChange={onChange} // Handle input changes
        />
    );
};

export default InputField;
