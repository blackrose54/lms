import { TriangleAlertIcon } from 'lucide-react'
import React from 'react'

interface props{
  text:string
}
function PublishBanner({text}:props) {
  return (
    <div className='w-full bg-primary/20 sticky  text-yellow-500 p-2 flex items-center justify-center gap-x-2 '>
      <TriangleAlertIcon size={20} className='' />
      <p>{text}</p>
    </div>
  )
}

export default PublishBanner