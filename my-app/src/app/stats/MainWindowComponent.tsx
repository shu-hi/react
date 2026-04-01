"use client";
import React, {useEffect, useState } from 'react';
import { ApiResult } from './commonTypes';
function MainWindowComponent({result}:{result:ApiResult<any[]>|null}){
    return (
        <div>
        {result && (result.status === 'ok'||result.status==='fallback') && result.data?.length > 0 && (
          <div className="mt-8 p-4 border rounded w-5/5">
            <h2 className="text-2xl font-semibold mb-2">result(~100)</h2>
            <table className="table-auto border-collapse border max-h-screen max-w-screen overflow-auto">
              <thead>
                <tr>
                  {Object.keys(result.data[0]).map((key) => (
                    <th key={key} className="border px-2 py-1 bg-gray-200 text-gray-800 text-left">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.data.slice(0, 100).map((item, index) => (
                  <tr key={index}>
                    {Object.values(item).map((value, i) => (
                      <td key={i} className="border px-2 py-1 text-sm">
                        {value === null ? '-' : String(value).slice(0,25)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {((result && result.status === 'ng' && result.error?.length > 0)) && (
          <div className="mt-8 p-4 border rounded w-4/5">
            {result?.error}
          </div>
        )}
        </div>
    )
}
export default MainWindowComponent;