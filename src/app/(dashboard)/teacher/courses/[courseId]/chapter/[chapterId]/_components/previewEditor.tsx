'use client'

import dynamic from "next/dynamic"
import 'react-quill/dist/quill.bubble.css'

import React,{ FC,ReactElement, useMemo } from 'react'

interface editorProps {
 value:string 
 className?:string
}

const PreviewEditor= ({value,className}:editorProps):ReactElement => {
    const ReactQuill = useMemo(()=>dynamic(()=>(import ('react-quill')),{ssr:false}),[])
    if(value == "") return (
        <p className=" text-muted-foreground basis-full">No Description</p>
    )
  return (
    <div className={className}>
        <ReactQuill readOnly value={value} theme="bubble" />
    </div>
  ) 
}

export default PreviewEditor