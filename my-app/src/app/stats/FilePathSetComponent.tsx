"use client";
import React, {useEffect, useState } from 'react';
interface FilePathSetProps{
    setFilePath:(path:string[])=>void;
    filePath:string[];
    sheetType:'csv'|'gss';
}
function FilePathSetComponent({setFilePath,filePath,sheetType}:FilePathSetProps){
    return(
        <div>
            {filePath.map((p,i)=>(
                <div key={i} >
                    gss_{i}:
                    <input 
                        type='text'
                        placeholder={`${sheetType}-path`}
                        value={filePath[i]}
                        onChange={(e)=>{setFilePath(filePath.map((c,index)=>{if(i==index){return e.target.value;}return c;}));}}
                    />
                    {i==0&&(<button type='button' onClick={(e)=>setFilePath([...filePath,''])} >+</button>)}
                    {i!==0&&(<button type='button' onClick={(e)=>setFilePath(filePath.filter((_, index) => index !== i))} >-</button>)}
                </div>
            ))}
        </div>
    )
}
export default FilePathSetComponent;