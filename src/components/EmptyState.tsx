import Image from "next/image"

const EmptyState = ({ message }: {message: string}) => {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500 italic">
            <Image
                src="/not-found.png"
                alt="no-programs"
                width={150}
                height={150}
                className="mb-2"
            />
            <p>{message}</p>
        </div>
    )
}

export default EmptyState