type SpinnerProps = {
  size?: number
  color?: string
}

const Loading = ({ size = 32 }: SpinnerProps) => {
  return (
    <div className="fixed flex inset-0 items-center justify-center z-50 bg-black/30 backdrop-blur-sm" style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
      <div className="flex flex-col items-center justify-center h-full py-10 animate-pulse">
        <div className="flex-col justify-center items-center">
          <div className="flex justify-center">
            <div className={`w-12 h-12 rounded-full animate-spin border-y-8 border-dashed border-amber-500 border-t-transparent`}
              style={{ width: size, height: size }}>
            </div>
          </div>
          <p className="text-amber-300 text-center">Loading</p>
        </div>
      </div>
    </div>
  )
}

export default Loading