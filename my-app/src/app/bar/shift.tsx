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
interface LoginProps {
  setLogin: (status: number) => void;
  setToken: (token: string) => void;
}
type ShiftData={
  date:string;
  first_name:string;
  start_datetime:string;
  end_datetime:string;
  selected_serial:string;
  serial:string;
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
function Shift({ setLogin, setToken }: LoginProps) {
  const storedToken = sessionStorage.getItem('access_token');
  const loginStatus=sessionStorage.getItem('login_status');
  const [shiftData, setShiftData] = useState<ShiftData[]>([]);
  const [available,setAvailable]=useState<Available[]>([])
  const[selectedEvent,setSelectedEvent]=useState<ShiftData>({selected_serial: '',
                    first_name:'',
                    date: '',
                    start_datetime:'',
                    end_datetime: '',
                    serial:  ''});
  const[modalMode,setModalMode]=useState<'date'|'event'|'close'>('close');
  function getFormattedDate(): string {
    const today = new Date();
    
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 月は0から始まるので +1
    const day = today.getDate().toString().padStart(2, '0'); // 2桁にするために0埋め
  
    return `${year}-${month}-${day}`;
  }
  const formatedDateString = getFormattedDate()
  useEffect(() => {  
    fetchShiftData(); 
    fetchAvailableUser();
  }, []);
  
  const handleDateClick = useCallback((arg: DateClickArg) => {
    if(loginStatus=='2'||loginStatus=='3'){
      setModalMode("date");
      const addingShift:ShiftData={date:arg.dateStr,start_datetime:'18:00',end_datetime:'23:00',first_name:'',serial:'',selected_serial:''}
      setSelectedEvent(addingShift);
    }
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
      if (res1.status === 401) {
        toast.error('session expired. please re-login to continue.');
        sessionStorage.clear();
        setToken('');
        setLogin(0);
      }
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
    if (selectedEvent.date &&selectedEvent.selected_serial&& selectedEvent.first_name && selectedEvent.start_datetime && selectedEvent.end_datetime) {
      const newShift: ShiftData = {
        date: selectedEvent.date,
        first_name: selectedEvent.first_name,
        start_datetime: selectedEvent.start_datetime,
        end_datetime: selectedEvent.end_datetime,
        selected_serial:selectedEvent.selected_serial,
        serial:'',
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
          setModalMode('close');
          fetchShiftData(); 
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    } else {
      console.log(selectedEvent.selected_serial);
      toast.error("すべてのフィールドを入力してください！");
    }
  };
  const handleDelShift = async(e: React.FormEvent) => {
    e.preventDefault();
      setShiftData((prevData) => prevData.filter(p=>p.serial!=selectedEvent?.serial)); // 新しいシフトデータを追加
      try {
        const res1 = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bar/del_shift`,
          {
            method:"POST",
            headers: {
                      "Content-Type": "application/json",
                      'Authorization': `Bearer ${storedToken}`,
                  },
            body: JSON.stringify({ serial:selectedEvent?.serial})
          }
        );
        
        const data: GetShiftApiResponse = await res1.json();
        if(data.status=='ok'){
          toast.success("success");
          setModalMode('close');
          fetchShiftData(); 
        }
      } catch (err) {
        console.error('Error fetching data:', err);
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
  const EvnetModalStyles = {
    content: {
      top: '10%', // 上端を中央に
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
        <div style={{ maxHeight: '50vh', overflowY: 'auto' ,position: 'relative'}}>
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
                  id:shift.serial,
                  title:shift.first_name,
                  // start:shift.start_datetime,
                  // end:shift.end_datetime,
                  date:shift.date
                }
              })
            }
            dateClick={handleDateClick}
            eventClick={function(e){
              setModalMode("event");
              let data=shiftData.find(s=>s.serial==e.event.id);
              if(data){
                setSelectedEvent(data);
              }
            }}/>
        </div>
      </div>
      <Modal isOpen={modalMode=='date'} style={customStyles}>
          {selectedEvent.date}
          <form onSubmit={handleAddShift} className="add-shift-form">
            <div className='flex'>
              <label className="block mb-0 text-zinc-500">worker</label>
              <select
                className="w-full p-1 mb-3 text-zinc-700 border-b-2 border-zinc-500 outline-none focus:bg-gray-300"
                defaultValue=""
                onChange={(e)=>{
                  const selectedOption = e.target.selectedOptions[0]; // 選択されたオプション要素
                  const selectedSerial = selectedOption.value; // serial（選択されたオプションのvalue）
                  const selectedName = selectedOption.innerText;
                  if(selectedName&&selectedSerial){
                    setSelectedEvent((prevState) => ({
                    ...prevState, 
                    selected_serial: selectedSerial,
                    first_name:selectedName,
                  }));
                  }
                  
                }}
                required>
                  <option value="" disabled hidden>選択してください</option>
                  {available.map((user)=>(
                    <option key={user.serial} value={user.serial}>{user.first_name}</option>
                  ))}
              </select>
            </div>
            <div className='flex'>
              <label className="block mb-0 text-zinc-500">start</label>
              <input 
                type='time'
                value={selectedEvent.start_datetime}
                className="w-full p-1 mb-3 text-zinc-700 border-b-2 border-zinc-500 outline-none focus:bg-gray-300"
                onChange={(e)=>{
                          if(e.target.value){
                    setSelectedEvent((prevState) => ({
                    ...prevState, 
                    start_datetime:e.target.value,
                  }))
                  }
                        }}
                required
              />
            </div>
            <div className='flex'>
              <label className="block mb-0 text-zinc-500">end</label>
              <input 
                type='time'
                value={selectedEvent.end_datetime}
                className="w-full p-1 mb-3 text-zinc-700 border-b-2 border-zinc-500 outline-none focus:bg-gray-300"
                onChange={(e)=>{
                  if(e.target.value){
                    setSelectedEvent((prevState) => ({
                    ...prevState, 
                    end_datetime:e.target.value,
                  }))
                  }
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
          <button onClick={()=>setModalMode('close')} className="w-full bg-zinc-700 hover:bg-pink-700 text-white font-bold py-0 px-4 mb-3 rounded">cancel</button>
        </Modal>
        <Modal isOpen={modalMode=='event'} style={EvnetModalStyles}>
          {selectedEvent?.date}<br />
          {selectedEvent?.first_name}<br />
          {selectedEvent?.start_datetime?.substring(0,selectedEvent.start_datetime.indexOf("+")).replace("T","  ")}~<br />
          {selectedEvent?.end_datetime?.substring(0,selectedEvent.end_datetime.indexOf("+")).replace("T","  ")}<br />
          {(loginStatus=='2'||loginStatus=='3')&&(<form onSubmit={handleDelShift} className="del-shift-form">
            <div>
              <button type="submit" className="w-full bg-zinc-700 hover:bg-pink-700 text-white font-bold py-0 px-4 mb-3 rounded">
                delete
              </button>
            </div>
          </form>)}
          <button onClick={()=>setModalMode('close')} className="w-full bg-zinc-700 hover:bg-pink-700 text-white font-bold py-0 px-4 mb-3 rounded">cancel</button>
        </Modal>
    </div>
  );
}

export default Shift;


