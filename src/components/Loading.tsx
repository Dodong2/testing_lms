type SpinnerProps = {
  size?: number
  color?: string
}

const Loading = ({ size = 32 }: SpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-10 animate-pulse">
      <div className="flex-col justify-center items-center">
        <div className="flex justify-center">
        <div className={`w-12 h-12 rounded-full animate-spin border-y-8 border-dashed border-amber-500 border-t-transparent`}
        style={{ width: size, height: size }}>
        </div>
        </div>
      <p className="text-gray-700 text-center">Loading</p>
      </div>
    </div>
  )
}

export default Loading