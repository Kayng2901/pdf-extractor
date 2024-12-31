import PDFExtractor from './components/ui/PDFExtractor'

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-300 via-white to-purple-300 dark:from-slate-900 dark:via-slate-800 dark:to-purple-800">
      {/* Floating background elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-[20rem] h-[20rem] bg-blue-400 rounded-full mix-blend-multiply opacity-40 animate-float1 dark:bg-blue-500 dark:opacity-30"></div>
        <div className="absolute top-1/3 right-1/3 w-[24rem] h-[24rem] bg-purple-400 rounded-full mix-blend-multiply opacity-40 animate-float2 dark:bg-purple-500 dark:opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[18rem] h-[18rem] bg-pink-400 rounded-full mix-blend-multiply opacity-40 animate-float3 dark:bg-pink-500 dark:opacity-30"></div>
        <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-teal-400 rounded-full mix-blend-multiply opacity-40 animate-float4 dark:bg-teal-500 dark:opacity-30"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply opacity-40 animate-float5 dark:bg-indigo-500 dark:opacity-30"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen -mt-20 relative z-10">
        <PDFExtractor />
      </div>
    </div>
  )
}

export default App