const LanguageSelector = () => {
  return (
    <div className="flex h-fit ml-auto absolute right-5">
      <div className="transition h-fit text-gray-600 font-bold hover:bg-gray-50 active:bg-gray-100 rounded-md px-2 py-1 cursor-pointer">
        EN
      </div>
      <div className="flex bg-gray-200 flex-1 mx-1" style={{ width: 1 }}></div>
      <div className="transition h-fit text-gray-300 hover:bg-gray-50 active:bg-gray-100 rounded-md px-2 py-1 cursor-pointer">
        UR
      </div>
    </div>
  )
}

export default LanguageSelector
