"use client";
import React, {useEffect, useState,useCallback } from 'react';
import { setFlagsFromString } from 'v8';
import { Session } from 'inspector/promises';
import { toast } from "react-hot-toast";
import Modal from "react-modal";

import './shift.css';

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { totalmem } from 'os';

type ShiftData={
  date:string;
  first_name:string;
  start_datetime:string;
  end_datetime:string;
  selected_serial:string;
}
type GetShiftApiResponse = {
  status: string;
  data: null|ShiftData[]
  err:string|null;
};
type Available={
  serial:string;
  first_name:string;
}
type GetAvailableApiResponse = {
  status: string;
  data: null|Available[]
  err:string|null;
};
function Shift() {
  const storedToken = sessionStorage.getItem('access_token');
  const [shiftData, setShiftData] = useState<ShiftData[]>([]);
  const [available,setAvailable]=useState<Available[]>([])
  const[selectedDate,setSelectedDate]=useState('');
  const[selectedSerial,setSelectedSerial]=useState('');
  const[selectedWorker,setSelectedWorker]=useState('');
  const[selectedStart,setSelectedStart]=useState('18:00');
  const[selectedEnd,setSelectedEnd]=useState('23:00');
  const formatedDateString = new Date().toLocaleDateString('ja-JP').replaceAll('/','-');
  useEffect(() => {  
    fetchShiftData(); 
    fetchAvailableUser();
  }, []);
  
  const handleDateClick = useCallback((arg: DateClickArg) => {
    setSelectedDate(arg.dateStr);//modal表示&日付set
    setSelectedWorker('');
    setSelectedStart('18:00');
    setSelectedEnd('18:00');
  }, []);
  const fetchShiftData=async()=>{
      try {
      const res1 = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bar/get_shift`,
        {
          method:"POST",
          headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${storedToken}`,
                },
          body: JSON.stringify({ date: formatedDateString})
        }
      );
      
      const data: GetShiftApiResponse = await res1.json();
      if(data.status=='ok'&& data.data && data.data.length > 1){
        setShiftData(data.data);
        
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };
  const fetchAvailableUser=async()=>{
      try {
      const res1 = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bar/get_available`,
        {
          method:"POST",
          headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${storedToken}`,
                },
          body: JSON.stringify({ date: formatedDateString})
        }
      );
      
      const data: GetAvailableApiResponse = await res1.json();
      if(data.status=='ok'&& data.data && data.data.length > 1){
        setAvailable(data.data);
      }else{
        console.error('Error fetching data');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };
  
  const handleAddShift = async(e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate &&selectedSerial&& selectedWorker && selectedStart && selectedEnd) {
      const newShift: ShiftData = {
        date: selectedDate,
        first_name: selectedWorker,
        start_datetime: selectedStart,
        end_datetime: selectedEnd,
        selected_serial:selectedSerial,
      };

      setShiftData((prevData) => [...prevData, newShift]); // 新しいシフトデータを追加
      try {
        const res1 = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bar/set_shift`,
          {
            method:"POST",
            headers: {
                      "Content-Type": "application/json",
                      'Authorization': `Bearer ${storedToken}`,
                  },
            body: JSON.stringify({ newShift})
          }
        );
        
        const data: GetShiftApiResponse = await res1.json();
        if(data.status=='ok'){
          toast.success("success");
          
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    } else {
      toast.error("すべてのフィールドを入力してください！");
    }
  };
  const customStyles = {
    content: {
      top: '20%', // 上端を中央に
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)', // 中央に配置
      minWidth: '40%',
      zIndex: 10000, // モーダルが前面に来るように
    },
  };
  Modal.setAppElement(".App");

  return (
    <div className="App flex bg-zinc-700 h-full" >
      <div className="w-full max-w-xs m-auto bg-zinc-100 rounded p-5">
        <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
          <FullCalendar 
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth" 
            headerToolbar= {{
                      left: 'prev',
                      center: 'title',
                      right: 'next',
            }}
            titleFormat={{
              year: 'numeric',
              month: 'short'
            }}
            height={'auto'}
            businessHours={true}
            events={
              shiftData.map((shift)=>{
                return {
                  title:shift.first_name,
                  start:shift.start_datetime,
                  end:shift.end_datetime,
                  date:shift.date
                }
              })
            }
            dateClick={handleDateClick}/>
        </div>
      </div>
      <Modal isOpen={selectedDate!=''} style={customStyles}>
          {selectedDate}
          <form onSubmit={handleAddShift} className="add-shift-form">
            <div className='flex'>
              <label className="block mb-0 text-zinc-500">worker</label>
              <select
                className="w-full p-1 mb-3 text-zinc-700 border-b-2 border-zinc-500 outline-none focus:bg-gray-300"
                onChange={(e)=>{
                  const selectedOption = e.target.selectedOptions[0]; // 選択されたオプション要素
                  const selectedSerial = selectedOption.value; // serial（選択されたオプションのvalue）
                  const selectedName = selectedOption.innerText;
                  setSelectedSerial(selectedSerial);
                  setSelectedWorker(selectedName);
                        }}
                required>
                  {available.map((user)=>(
                    <option key={user.serial} value={user.serial}>{user.first_name}</option>
                  ))}
              </select>
            </div>
            <div className='flex'>
              <label className="block mb-0 text-zinc-500">start</label>
              <input 
                type='time'
                value={selectedStart}
                className="w-full p-1 mb-3 text-zinc-700 border-b-2 border-zinc-500 outline-none focus:bg-gray-300"
                onChange={(e)=>{
                          setSelectedStart(e.target.value)
                        }}
                required
              />
            </div>
            <div className='flex'>
              <label className="block mb-0 text-zinc-500">end</label>
              <input 
                type='time'
                value={selectedEnd}
                className="w-full p-1 mb-3 text-zinc-700 border-b-2 border-zinc-500 outline-none focus:bg-gray-300"
                onChange={(e)=>{
                          setSelectedEnd(e.target.value)
                        }}
                required
              />
            </div>
            <div>
              <button type="submit" className="w-full bg-zinc-700 hover:bg-pink-700 text-white font-bold py-0 px-4 mb-3 rounded">
                submit
              </button>
            </div>
          </form>
          <button onClick={()=>setSelectedDate('')} className="w-full bg-zinc-700 hover:bg-pink-700 text-white font-bold py-0 px-4 mb-3 rounded">cancel</button>
        </Modal>
    </div>
  );
}

export default Shift;


