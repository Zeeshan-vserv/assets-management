import React, { useState } from 'react'
import { GrCubes } from 'react-icons/gr'
import { LiaToolsSolid } from 'react-icons/lia'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import { RxDashboard } from 'react-icons/rx'
import { TbReportSearch } from 'react-icons/tb'

const Navigation = ({ nav, setNav }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const renderSubMenu = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <>
            <h3 className='hover:underline cursor-pointer'>incident</h3>
            <h3 className='hover:underline cursor-pointer'>request</h3>
            <h3 className='hover:underline cursor-pointer'>software</h3>
            <h3 className='hover:underline cursor-pointer'>task</h3>
            <h3 className='hover:underline cursor-pointer'>assets</h3>
            <h3 className='hover:underline cursor-pointer'>vendor</h3>
          </>
        );
      case 'servicedesk':
        return (
          <>
            <h3 className='hover:underline cursor-pointer'>incidents</h3>
            <h3 className='hover:underline cursor-pointer'>service request</h3>
            <h3 className='hover:underline cursor-pointer'>tasks</h3>
            <h3 className='hover:underline cursor-pointer'>vendors</h3>
            <h3 className='hover:underline cursor-pointer'>knowledge base</h3>
            <h3 className='hover:underline cursor-pointer'>documents</h3>
          </>
        );
      case 'assets':
        return (
          <>
            <h3 className='hover:underline cursor-pointer'>assets</h3>
            <h3 className='hover:underline cursor-pointer'>preventive</h3>
            <h3 className='hover:underline cursor-pointer'>gate pass</h3>
          </>
        );
      case 'reports':
        return (
          <>
            <h3 className='hover:underline cursor-pointer'>reports</h3>
            <h3 className='hover:underline cursor-pointer'>audit logs</h3>
          </>
        );
      case 'configuration':
        return (
          <>
            <h3 className='hover:underline cursor-pointer'>global</h3>
            <h3 className='hover:underline cursor-pointer'>incidents</h3>
            <h3 className='hover:underline cursor-pointer'>sla</h3>
            <h3 className='hover:underline cursor-pointer'>request</h3>
            <h3 className='hover:underline cursor-pointer'>assets</h3>
            <h3 className='hover:underline cursor-pointer'>gate pass</h3>
            <h3 className='hover:underline cursor-pointer'>vendor</h3>
            <h3 className='hover:underline cursor-pointer'>locense</h3>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className='flex'>
      <div className='w-fit h-screen p-5 flex flex-col gap-8 text-2xl bg-gray-800 text-white'>
        <RxDashboard className={`${activeMenu == 'dashboard'? "text-blue-400" :"" } cursor-pointer`} onClick={() => {setActiveMenu('dashboard'); setNav(true)}} />
        <LiaToolsSolid className={`${activeMenu == 'servicedesk'? "text-blue-400" :"" } cursor-pointer`} onClick={() => {setActiveMenu('servicedesk'); setNav(true)}} />
        <GrCubes className={`${activeMenu == 'assets'? "text-blue-400" :"" } cursor-pointer`}  onClick={() => {setActiveMenu('assets'); setNav(true)}} />
        <TbReportSearch className={`${activeMenu == 'reports'? "text-blue-400" :"" } cursor-pointer`}  onClick={() => {setActiveMenu('reports'); setNav(true)}} />
        <MdOutlineAdminPanelSettings className={`${activeMenu == 'configuration'? "text-blue-400" :"" } cursor-pointer`}  onClick={() => {setActiveMenu('configuration'); setNav(true)}} />
      </div>

      <div className={`w-40 h-screen p-7 text-xs flex flex-col gap-3 bg-gray-900 text-white uppercase ${nav ? "" : "hidden"} `}>
        {renderSubMenu()}
      </div>
    </div>
  )
}

export default Navigation