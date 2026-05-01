"use client";
import React, {useEffect, useState } from 'react';
import { ApiResult } from './commonTypes';
function ResultWindowComponent({statsResult}:{statsResult:ApiResult<any[]>|null}){
  console.log(statsResult?.data)
    return (
        <div className='grid-item'>
        {statsResult && (statsResult.status === 'ok'||statsResult.status==='fallback') && statsResult.data && (
          <div className="mt-8 p-4 border rounded w-5/5">
            <h2 className="text-2xl font-semibold mb-2">statsResult(~100)</h2>
            <table className="table-auto border-collapse border max-h-screen max-w-screen overflow-auto">
              <thead>
                <tr>
                  <th className="border px-2 py-1 bg-gray-200 text-gray-800 text-left">
                    key
                  </th>
                  <th className="border px-2 py-1 bg-gray-200 text-gray-800 text-left">
                    value
                  </th>
                </tr>
              </thead>
              <tbody>
                  
                  {Object.entries(statsResult.data).map(([key,value]) => (
                    <tr key={key}>
                      <td className="border px-2 py-1 text-sm">
                        {key}
                      </td>
                      <td className="border px-2 py-1 text-sm">
                        {value === null ? '-' : String(value).slice(0,25)}
                      </td>
                    </tr>
                  ))}
                  
              </tbody>
            </table>
          </div>
        )}
        {((statsResult && statsResult.status === 'ng' && statsResult.error?.length > 0)) && (
          <div className="mt-8 p-4 border rounded w-4/5">
            {statsResult?.error}
          </div>
        )}
        </div>
    )
}
export default ResultWindowComponent;