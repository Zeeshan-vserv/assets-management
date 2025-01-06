import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signup } from "../../action/AuthAction";

const AddUsers = () => {

  const dispatch = useDispatch()
  const [formData, setFormData] = useState({businessUnit:"", employeeName:"", employeeCode:"", grade:"", emailAddress:"", mobileNumber:"", designation:"", costCenter:"", location:"", subLocation:"", department:"", subDepartment:"", reportingManager:"", departmentHead:"", businessHead:"", vipUser:"", password:"", confirmPassword:""})

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signup(formData))
  }
  return (
    <div className="w-[100%] p-6 flex flex-col gap-5 bg-slate-200">
      <h2 className="text-slate-700 font-semibold">ADD USER</h2>
      <form action="" onSubmit={handleSubmit}>
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <div className="flex gap-1 justify-end">
            <button type="submit" className="bg-[#8092D1] shadow-[#8092D1] shadow-md py-1.5 px-3 rounded-md text-sm text-white">
              Submit
            </button>
            <button className="bg-[#F26E75] shadow-[#F26E75] shadow-md py-1.5 px-3 rounded-md text-sm text-white">
              Cancel
            </button>
          </div>
          <div className="flex flex-wrap gap-6 justify-between mt-3">
            <div className="flex items-center w-[46%]">
              <label htmlFor="businessUnit" className="w-[25%] text-xs font-semibold text-slate-600">Business Unit </label>
              <select className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500" name="businessUnit" id="businessUnit"
              value={formData.businessUnit}
              onChange={handleChange}>
                <option value="">Select</option>
                <option value="1">Business Unit 1</option>
                <option value="2">Business Unit 2</option>
              </select>
            </div>
            <div className="flex items-center w-[46%]">
              <label htmlFor="employeeName" className="w-[25%] text-xs font-semibold text-slate-600">Employee Name</label>
              <input className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500" type="text" id="employeeName" name="employeeName"
              value={formData.employeeName}
              onChange={handleChange} />
            </div>
            <div className="flex items-center w-[46%]">
              <label htmlFor="employeeCode" className="w-[25%] text-xs font-semibold text-slate-600">Employee Code</label>
              <input className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500" type="text" id="employeeCode" name="employeeCode"
              value={formData.employeeCode}
              onChange={handleSubmit}/>
            </div>
            <div className="flex items-center w-[46%]">
              <label htmlFor="grade" className="w-[25%] text-xs font-semibold text-slate-600">Grade</label>
              <select className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500" name="grade" id="grade"
              value={formData.grade}
              onChange={handleChange}>
                <option value="">Select</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>
            <div className="flex items-center w-[46%]">
              <label htmlFor="employeeAddress" className="w-[25%] text-xs font-semibold text-slate-600">Employee Address</label>
              <input className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500" type="email" id="employeeAddress" name="employeeAddress"
              value={formData.emailAddress}
              onChange={handleChange}/>
            </div>
            <div className="flex items-center w-[46%]">
              <label htmlFor="mobileNumber" className="w-[25%] text-xs font-semibold text-slate-600">Mobile Number</label>
              <input className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500" type="text" id="mobileNumber" name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}/>
            </div>
            <div className="flex items-center w-[46%]">
              <label htmlFor="designation" className="w-[25%] text-xs font-semibold text-slate-600">Designation</label>
              <input className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500" type="text" id="designation" name="designation"
              value={formData.designation}
              onChange={handleChange}/>
            </div>
            <div className="flex items-center w-[46%]">
              <label htmlFor="costCentre" className="w-[25%] text-xs font-semibold text-slate-600">Cost Centre</label>
              <select className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500" name="costCentre" id="costCentre"
              value={formData.costCenter}
              onChange={handleChange}>
                <option value="">Select</option>
                <option value="N/A">N/A</option>
              </select>
            </div>
            <div className="flex items-center w-[46%]">
              <label htmlFor="location" className="w-[25%] text-xs font-semibold text-slate-600">Location</label>
              <select className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500" name="location" id="location"
              value={formData.location}
              onChange={handleChange}>
                <option value="">Select Location</option>
                <option value="agra">AGRA</option>
                <option value="ahmedabad">AHMEDABAD</option>
                <option value="banglore">BANGLORE</option>
                <option value="bokaro">BOKARO</option>
                <option value="bokaburnpurro">BURNPUR</option>
                <option value="chandigarh">CHANDIGARH</option>
                <option value="chattisgarh">CHATTISGARH</option>
                <option value="chennai">CHENNAI</option>
                <option value="coimbatore">COIMBATORE</option>
                <option value="dankuni">DANKUNI</option>
                <option value="delhi">DELHI</option>
                <option value="durgapur">DURGAPUR</option>
                <option value="faridabad">FARIDABAD</option>
                <option value="ghaziabad">GHAZIABAD</option>
                <option value="gujarat">GUJARAT</option>
                <option value="guwahati">GUWAHATI</option>
                <option value="haldia">HALDIA</option>
                <option value="hyderabad">HYDERABAD</option>
                <option value="jagdishpur">JAGDISHPUR</option>
                <option value="jalandhar">JALANDHAR</option>
                <option value="jammu">JAMMU</option>
                <option value="kandrori">KANDRORI</option>
                <option value="kanpur">KANPUR</option>
                <option value="kochi">KOCHI</option>
                <option value="kolkata">KOLKATA</option>
                <option value="lucknow">LUCKNOW</option>
                <option value="ludhiana">LUDHIANA</option>
                <option value="madhya pradesh">MADHYA PRADESH</option>
                <option value="maharashtra">MAHARASHTRA</option>
                <option value="manali">MANALI</option>
                <option value="mandigobindgarh">MANDIGOBINDGARH</option>
                <option value="N/A">N/A</option>
                <option value="paradeep">PARADEEP</option>
                <option value="patna">PATNA</option>
                <option value="prayagraj">PRAYAGRAJ</option>
                <option value="rajasthan">RAJASTHAN</option>
                <option value="rishikesh">RISHIKESH</option>
                <option value="roorkela">ROORKELA</option>
                <option value="salem">SALEM</option>
                <option value="siliguri">SILIGURI</option>
                <option value="srinagar">SRINAGAR</option>
                <option value="trichy">TRICHY</option>
                <option value="vizag">VIZAG</option>
              </select>
            </div>
            <div className="flex items-center w-[46%]">
              <label htmlFor="subLocation" className="w-[25%] text-xs font-semibold text-slate-600">Sub Location</label>
              <input className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500" type="text" id="subLocation" name="subLocation"
              value={formData.subLocation}
              onChange={handleChange} />
            </div>
            <div className="flex items-center w-[46%]">
              <label htmlFor="department" className="w-[25%] text-xs font-semibold text-slate-600">Department</label>
              <input className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500" type="text" id="department" name="department"
              value={formData.department}
              onChange={handleChange} />
            </div>
            <div className="flex items-center w-[46%]">
              <label htmlFor="subDepartment" className="w-[25%] text-xs font-semibold text-slate-600">Sub Department</label>
              <input className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500" type="text" id="subDepartment" name="subDepartment"
              value={formData.subDepartment}
              onChange={handleChange} />
            </div>
            <div className="flex items-center w-[46%]">
              <label htmlFor="reportingManager" className="w-[25%] text-xs font-semibold text-slate-600">Reporting Manager</label>
              <input className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500" type="text" id="reportingManager" name="reportingManager"
              value={formData.reportingManager}
              onChange={handleChange} />
            </div>
            <div className="flex items-center w-[46%]">
              <label htmlFor="departmentHead" className="w-[25%] text-xs font-semibold text-slate-600">Department Head</label>
              <input className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500" type="text" id="departmentHead" name="departmentHead"
              value={formData.departmentHead}
              onChange={handleChange} />
            </div>
            <div className="flex items-center w-[46%]">
              <label htmlFor="businessHead" className="w-[25%] text-xs font-semibold text-slate-600">Business Head</label>
              <input className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500" type="text" id="businessHead" name="businessHead"
              value={formData.businessHead}
              onChange={handleChange} />
            </div>
            <div className="flex items-center w-[46%]">
              <label htmlFor="vipUser" className="w-[25%] text-xs font-semibold text-slate-600">VIP User</label>
              <input className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500" type="text" id="vipUser" name="vipUser"
              value={formData.vipUser}
              onChange={handleChange} />
            </div>
            <div className="flex items-center w-[46%]">
              <label htmlFor="password" className="w-[25%] text-xs font-semibold text-slate-600">Password</label>
              <input className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500" type="password" id="password" name="password"
              value={formData.password}
              onChange={handleChange} />
            </div>
            <div className="flex items-center w-[46%]">
              <label htmlFor="confirmPassword" className="w-[25%] text-xs font-semibold text-slate-600">
              Confirm Password</label>
              <input className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500" type="password" id="confirmPassword" name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddUsers;
