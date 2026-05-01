"use client";
import React, {useEffect, useState } from 'react';
import { ApiResult } from './commonTypes';
function SubWindowComponent({subResult}:{subResult:ApiResult<any[]>|null}){
    return (
        <div className='grid-item'>
        {subResult && (subResult.status === 'ok'||subResult.status==='fallback') && subResult.blob?.length > 0 && (
          <div className="mt-8 p-4 border rounded w-5/5">
            <h2 className="text-2xl font-semibold mb-2">subResult(~100)</h2>
            <img src={`data:image/png;base64,${subResult.blob}`} alt="Linreg Plot" />
          </div>
        )}
        {((subResult && subResult.status === 'ng' && subResult.error?.length > 0)) && (
          <div className="mt-8 p-4 border rounded w-4/5">
            {subResult?.error}
          </div>
        )}
        </div>
    )
}
export default SubWindowComponent;