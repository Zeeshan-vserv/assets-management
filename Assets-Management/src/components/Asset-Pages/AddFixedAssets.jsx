import React from 'react'

const AddFixedAssets = () => {
  return (
    <div className='w-[100%] p-6 flex flex-col gap-5 bg-slate-200'>
        <h2 className='text-slate-700 font-semibold'>NEW ASSET</h2>
        <form action="">
            {/* Asset Information fields */}
            <div className='w-full p-5 bg-white rounded-md shadow-md'>
                <div className='flex gap-1 justify-end'>
                    <button className='bg-[#8092D1] border-1 border-[#8092D1] shadow-xl py-1.5 px-3 rounded-md text-sm text-white'>submit</button>
                    <button className='bg-[#F26E75] border-1 border-[#F26E75] shadow-xl py-1.5 px-3 rounded-md text-sm text-white'>cancel</button>
                </div>
                <h3 className='text-slate-700'>Asset Information</h3>
                <div>
                <div className='flex items-center gap-5'>
                    <label htmlFor="assetName">Business Unit</label>
                    <input type="text" id='assetName' className='border-b-2 border-slate-300 p-1 outline-none focus:border-blue-500'/>
                </div>
                </div>
            </div>
        </form>
    </div>
  )
}

export default AddFixedAssets