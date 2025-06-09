import React, { useState } from 'react'
import { GrCubes } from 'react-icons/gr'
import { LiaToolsSolid } from 'react-icons/lia'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import { RxDashboard } from 'react-icons/rx'
import { TbReportSearch } from 'react-icons/tb'
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import { NavLink } from 'react-router-dom'

const Navigation = ({ nav, setNav }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [expandedSubMenus, setExpandedSubMenus] = useState({});


  const toggleSubMenu = (menu) => {
    setExpandedSubMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const renderSubMenu = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => {setNav(false)}} >incident</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => {setNav(false)}} >request</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => {setNav(false)}} >software</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => {setNav(false)}} >task</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => {setNav(false)}} >assets</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => {setNav(false)}} >vendor</h3>
          </>
        );
      case 'servicedesk':
        return (
          <>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => {setNav(false)}} >incidents</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => {setNav(false)}} >service request</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => {setNav(false)}} >tasks</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => {setNav(false)}} >vendors</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => {setNav(false)}} >knowledge base</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => {setNav(false)}} >documents</h3>
          </>
        );
      case 'assets':
        return (
          <>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => {toggleSubMenu('assets')}} >assets  {expandedSubMenus.assets ?<IoMdArrowDropdown />: <IoMdArrowDropright />}</h3>
            {expandedSubMenus.assets && (
              <ul className='flex flex-col gap-2 list-disc pl-5 '>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >manage</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >summary</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >assets import</li>
                </ul>
            )}
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => {setNav(false)}} >preventive</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => {setNav(false)}} >gate pass</h3>
          </>
        );
      case 'reports':
        return (
          <>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer'  onClick={() => toggleSubMenu('reports')}>reports {expandedSubMenus.reports ?<IoMdArrowDropdown />: <IoMdArrowDropright />}</h3>
            {expandedSubMenus.reports && (
              <ul className='flex flex-col gap-2 list-disc pl-5 '>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >sla creation</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >sla mapping</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >sla timelines</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >priority matix</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >holiday calendar</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >holiday list</li>
                </ul>
            )}
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => toggleSubMenu('auditLogs')}>audit logs {expandedSubMenus.auditLogs ?<IoMdArrowDropdown />: <IoMdArrowDropright />}</h3>
            {expandedSubMenus.auditLogs && (
              <ul className='flex flex-col gap-2 list-disc pl-5 '>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >sla creation</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >sla mapping</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >sla timelines</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >priority matix</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >holiday calendar</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >holiday list</li>
                </ul>
            )}
          </>
        );
      case 'configuration':
        return (
          <>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => toggleSubMenu('global')}>
              global {expandedSubMenus.global ?<IoMdArrowDropdown />: <IoMdArrowDropright />}
            </h3>
            {expandedSubMenus.global && (
              <ul className='flex flex-col gap-2 list-disc pl-5 '>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}}  ><NavLink to="/main/configuration/Users" className={({ isActive }) => `hover:underline cursor-pointer ${isActive ? 'text-blue-400' : ''}`}>Users</NavLink></li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} ><NavLink to="/main/configuration/components" className={({ isActive }) => `hover:underline cursor-pointer ${isActive ? 'text-blue-400' : ''}`}>components</NavLink></li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} ><NavLink to="/main/configuration/department" className={({ isActive }) => `hover:underline cursor-pointer ${isActive ? 'text-blue-400' : ''}`}>Department</NavLink></li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >sub department</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >location</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >sub location</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >organisation info</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >import user</li>
              </ul>
            )}
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => toggleSubMenu('incidents')}>
              incidents {expandedSubMenus.incidents ?<IoMdArrowDropdown />: <IoMdArrowDropright />}
            </h3>
            {expandedSubMenus.incidents && (
              <ul className='flex flex-col gap-2 list-disc pl-5 '>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >add prefix</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >auto closed time</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >closer code</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >predefined replies</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >pending reason</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >category</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >sub category</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >rules</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >escalatio level</li>
                </ul>
            )}
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => toggleSubMenu('sla')}>sla {expandedSubMenus.sla ?<IoMdArrowDropdown />: <IoMdArrowDropright />}</h3>
            {expandedSubMenus.sla && (
              <ul className='flex flex-col gap-2 list-disc pl-5 '>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >sla creation</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >sla mapping</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >sla timelines</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >priority matix</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >holiday calendar</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >holiday list</li>
                </ul>
            )}
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => toggleSubMenu('request')}>request {expandedSubMenus.request ?<IoMdArrowDropdown />: <IoMdArrowDropright />}</h3>
            {expandedSubMenus.request && (
              <ul className='flex flex-col gap-2 list-disc pl-5 '>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >auto closed time</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >predefined replies</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >category</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >sub category</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >templates</li>
                <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >rules</li>
                </ul>
            )}
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => {setNav(false)}} >gate pass</h3>
            {/* <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => {setNav(false)}} >vendor</h3> */}
            {/* <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => {setNav(false)}} >license</h3> */}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className='flex h-full'>
      <div className='w-fit h-[calc(100vh-3.5rem)] p-5 flex flex-col gap-8 text-2xl bg-gray-800 text-white'>
        <RxDashboard title='Dashboard' className={`${activeMenu == 'dashboard'? "text-blue-400" :"" } cursor-pointer`} onClick={() => {setActiveMenu('dashboard'); setNav(true)}} />
        <LiaToolsSolid title='Service Desk' className={`${activeMenu == 'servicedesk'? "text-blue-400" :"" } cursor-pointer`} onClick={() => {setActiveMenu('servicedesk'); setNav(true)}} />
        <GrCubes title='Assets' className={`${activeMenu == 'assets'? "text-blue-400" :"" } cursor-pointer`}  onClick={() => {setActiveMenu('assets'); setNav(true)}} />
        <TbReportSearch title='Reports' className={`${activeMenu == 'reports'? "text-blue-400" :"" } cursor-pointer`}  onClick={() => {setActiveMenu('reports'); setNav(true)}} />
        <MdOutlineAdminPanelSettings title='Configuration' className={`${activeMenu == 'configuration'? "text-blue-400" :"" } cursor-pointer`}  onClick={() => {setActiveMenu('configuration'); setNav(true)}} />
      </div>

      <div className={`w-40 h-[calc(100vh-3.5rem)] p-7 text-xs flex flex-col gap-3 bg-gray-900 text-white uppercase overflow-y-auto ${nav ? "" : "hidden"} `}>
        {renderSubMenu()}
      </div>
    </div>
  )
}

export default Navigation