interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name?: string
    register?: any
    validationSchema?: any
}

export default function Input({ name, register, validationSchema, ...rest }: InputProps) {
    const reg = register ? register(name, validationSchema) : null
    return (
        <input
            className='font-lg bg-zinc-900 border-2 border-zinc-700 rounded p-2'
            {...rest}
            {...reg}
        />
    )
}
