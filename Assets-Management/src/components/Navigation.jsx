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
            <h3 className='flex items-center justify-between hover:underline cursor-pointer'>incident</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer'>request</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer'>software</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer'>task</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer'>assets</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer'>vendor</h3>
          </>
        );
      case 'servicedesk':
        return (
          <>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer'>incidents</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer'>service request</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer'>tasks</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer'>vendors</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer'>knowledge base</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer'>documents</h3>
          </>
        );
      case 'assets':
        return (
          <>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => toggleSubMenu('assets')}>assets  {expandedSubMenus.assets ?<IoMdArrowDropdown />: <IoMdArrowDropright />}</h3>
            {expandedSubMenus.assets && (
              <ul className='flex flex-col gap-2 list-disc pl-5 '>
                <li className='text-[11px] hover:underline'>manage</li>
                <li className='text-[11px] hover:underline'>summary</li>
                <li className='text-[11px] hover:underline'>assets import</li>
                </ul>
            )}
            <h3 className='flex items-center justify-between hover:underline cursor-pointer'>preventive</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer'>gate pass</h3>
          </>
        );
      case 'reports':
        return (
          <>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => toggleSubMenu('reports')}>reports {expandedSubMenus.reports ?<IoMdArrowDropdown />: <IoMdArrowDropright />}</h3>
            {expandedSubMenus.reports && (
              <ul className='flex flex-col gap-2 list-disc pl-5 '>
                <li className='text-[11px] hover:underline'>sla creation</li>
                <li className='text-[11px] hover:underline'>sla mapping</li>
                <li className='text-[11px] hover:underline'>sla timelines</li>
                <li className='text-[11px] hover:underline'>priority matix</li>
                <li className='text-[11px] hover:underline'>holiday calendar</li>
                <li className='text-[11px] hover:underline'>holiday list</li>
                </ul>
            )}
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => toggleSubMenu('auditLogs')}>audit logs {expandedSubMenus.auditLogs ?<IoMdArrowDropdown />: <IoMdArrowDropright />}</h3>
            {expandedSubMenus.auditLogs && (
              <ul className='flex flex-col gap-2 list-disc pl-5 '>
                <li className='text-[11px] hover:underline'>sla creation</li>
                <li className='text-[11px] hover:underline'>sla mapping</li>
                <li className='text-[11px] hover:underline'>sla timelines</li>
                <li className='text-[11px] hover:underline'>priority matix</li>
                <li className='text-[11px] hover:underline'>holiday calendar</li>
                <li className='text-[11px] hover:underline'>holiday list</li>
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
                <li className='text-[11px] hover:underline'>vip users</li>
                {/* <li className='text-[11px] hover:underline'>users</li> */}
                <li className='text-[11px] hover:underline'><NavLink to="/main/configuration/Users" className={({ isActive }) => `hover:underline cursor-pointer ${isActive ? 'text-blue-400' : ''}`}>Users</NavLink></li>
                <li className='text-[11px] hover:underline'>technicians</li> 
                <li className='text-[11px] hover:underline'><NavLink to="/main/configuration/components" className={({ isActive }) => `hover:underline cursor-pointer ${isActive ? 'text-blue-400' : ''}`}>components</NavLink></li>
                <li className='text-[11px] hover:underline'>business units</li>
                <li className='text-[11px] hover:underline'>department</li>
                <li className='text-[11px] hover:underline'>sub department</li>
                <li className='text-[11px] hover:underline'>location</li>
                <li className='text-[11px] hover:underline'>sub location</li>
                <li className='text-[11px] hover:underline'>floor</li>
                <li className='text-[11px] hover:underline'>status</li>
                <li className='text-[11px] hover:underline'>support department</li>
                <li className='text-[11px] hover:underline'>support group</li>
                <li className='text-[11px] hover:underline'>active directory</li>
                <li className='text-[11px] hover:underline'>rbac</li>
                <li className='text-[11px] hover:underline'>smtp</li>
                <li className='text-[11px] hover:underline'>organisation info</li>
                <li className='text-[11px] hover:underline'>roles</li>
                <li className='text-[11px] hover:underline'>import user</li>
                <li className='text-[11px] hover:underline'>cost center</li>
                <li className='text-[11px] hover:underline'>page permissions</li>
                <li className='text-[11px] hover:underline'>knowledge category</li>
                <li className='text-[11px] hover:underline'>knowledge sub category</li>
                <li className='text-[11px] hover:underline'>knowledge sub category</li>
              </ul>
            )}
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => toggleSubMenu('incidents')}>
              incidents {expandedSubMenus.incidents ?<IoMdArrowDropdown />: <IoMdArrowDropright />}
            </h3>
            {expandedSubMenus.incidents && (
              <ul className='flex flex-col gap-2 list-disc pl-5 '>
                <li className='text-[11px] hover:underline'>add prefix</li>
                <li className='text-[11px] hover:underline'>auto closed time</li>
                <li className='text-[11px] hover:underline'>closer code</li>
                <li className='text-[11px] hover:underline'>predefined replies</li>
                <li className='text-[11px] hover:underline'>pending reason</li>
                <li className='text-[11px] hover:underline'>category</li>
                <li className='text-[11px] hover:underline'>sub category</li>
                <li className='text-[11px] hover:underline'>rules</li>
                <li className='text-[11px] hover:underline'>escalatio level</li>
                </ul>
            )}
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => toggleSubMenu('sla')}>sla {expandedSubMenus.sla ?<IoMdArrowDropdown />: <IoMdArrowDropright />}</h3>
            {expandedSubMenus.sla && (
              <ul className='flex flex-col gap-2 list-disc pl-5 '>
                <li className='text-[11px] hover:underline'>sla creation</li>
                <li className='text-[11px] hover:underline'>sla mapping</li>
                <li className='text-[11px] hover:underline'>sla timelines</li>
                <li className='text-[11px] hover:underline'>priority matix</li>
                <li className='text-[11px] hover:underline'>holiday calendar</li>
                <li className='text-[11px] hover:underline'>holiday list</li>
                </ul>
            )}
            <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => toggleSubMenu('request')}>request {expandedSubMenus.request ?<IoMdArrowDropdown />: <IoMdArrowDropright />}</h3>
            {expandedSubMenus.request && (
              <ul className='flex flex-col gap-2 list-disc pl-5 '>
                <li className='text-[11px] hover:underline'>auto closed time</li>
                <li className='text-[11px] hover:underline'>predefined replies</li>
                <li className='text-[11px] hover:underline'>category</li>
                <li className='text-[11px] hover:underline'>sub category</li>
                <li className='text-[11px] hover:underline'>templates</li>
                <li className='text-[11px] hover:underline'>rules</li>
                </ul>
            )}
            <h3 className='flex items-center justify-between hover:underline cursor-pointer'>gate pass</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer'>vendor</h3>
            <h3 className='flex items-center justify-between hover:underline cursor-pointer'>locense</h3>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className='flex h-full'>
      <div className='w-fit h-[calc(100vh-3.5rem)] p-5 flex flex-col gap-8 text-2xl bg-gray-800 text-white'>
        <RxDashboard className={`${activeMenu == 'dashboard'? "text-blue-400" :"" } cursor-pointer`} onClick={() => {setActiveMenu('dashboard'); setNav(true)}} />
        <LiaToolsSolid className={`${activeMenu == 'servicedesk'? "text-blue-400" :"" } cursor-pointer`} onClick={() => {setActiveMenu('servicedesk'); setNav(true)}} />
        <GrCubes className={`${activeMenu == 'assets'? "text-blue-400" :"" } cursor-pointer`}  onClick={() => {setActiveMenu('assets'); setNav(true)}} />
        <TbReportSearch className={`${activeMenu == 'reports'? "text-blue-400" :"" } cursor-pointer`}  onClick={() => {setActiveMenu('reports'); setNav(true)}} />
        <MdOutlineAdminPanelSettings className={`${activeMenu == 'configuration'? "text-blue-400" :"" } cursor-pointer`}  onClick={() => {setActiveMenu('configuration'); setNav(true)}} />
      </div>

      <div className={`w-40 h-[calc(100vh-3.5rem)] p-7 text-xs flex flex-col gap-3 bg-gray-900 text-white uppercase overflow-y-auto ${nav ? "" : "hidden"} `}>
        {renderSubMenu()}
      </div>
    </div>
  )
}

export default Navigation