'use client'

import dynamic from "next/dynamic"
import 'react-quill/dist/quill.snow.css'

import React,{ FC,ReactElement, useMemo } from 'react'

interface editorProps {
 onChange:(value:string)=>void,
 value?:string ,
 className?:string
 
}

const Editor= ({onChange,value,className}:editorProps):ReactElement => {
    const ReactQuill = useMemo(()=>dynamic(()=>(import ('react-quill')),{ssr:false}),[])
  return (
    <div className={className}>
        <ReactQuill onChange={onChange} value={value ?? ""} theme="snow" />

    </div>
  ) 
}

export default Editor