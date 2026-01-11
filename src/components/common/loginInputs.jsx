
function Input({ message, type = 'text', value, onChange, name}) {
    return (
        <>
            <input
                type={type}
                className="w-[90%]  bg-[#111111] rounded-[10px] p-3 text-[.8rem] outline-none"
                placeholder={message}
                value={value}
                onChange={onChange}
                name={name}
                autoComplete={name}
            />
        </>
    )
}

export default Input;