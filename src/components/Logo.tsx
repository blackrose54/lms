import Image from 'next/image'
import React,{ FC,ReactElement } from 'react'

interface LogoProps {
 size?:number; 
}

const Logo: FC<LogoProps> = ({size}):ReactElement => {
  return (
    <div className=' flex items-center justify-start gap-x-1'>
        <Image src='/logo.svg' alt='logo' width={size || 50} height={size || 50} />
        <span className=' text-2xl font-bold'>
          Drive
        </span>
    </div>
  )

}

export default Logo