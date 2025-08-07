import React, { useEffect, useState } from "react";
import { GrCubes } from "react-icons/gr";
import { LiaToolsSolid } from "react-icons/lia";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { TbReportSearch } from "react-icons/tb";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserById } from "../api/AuthRequest";

const Navigation = ({ nav, setNav }) => {
  const user = useSelector((state) => state.authReducer.authData);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [expandedSubMenus, setExpandedSubMenus] = useState({});

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await getUserById(user.userId);
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      setUserData(response?.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // console.log(userData);

  const toggleSubMenu = (menu) => {
    setExpandedSubMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const renderSubMenu = () => {
    switch (activeMenu) {
      case "dashboard":
        return (
          <>
            <h3
              className="flex items-center justify-between hover:underline cursor-pointer"
              onClick={() => {
                setNav(false);
              }}
            >
              <NavLink
                to="/main/dashboard/incident"
                className={({ isActive }) =>
                  `hover:underline cursor-pointer ${
                    isActive ? "text-blue-400" : ""
                  }`
                }
              >
                incident
              </NavLink>
            </h3>
            <h3
              className="flex items-center justify-between hover:underline cursor-pointer"
              onClick={() => {
                setNav(false);
              }}
            >
              <NavLink
                to="/main/dashboard/request"
                className={({ isActive }) =>
                  `hover:underline cursor-pointer ${
                    isActive ? "text-blue-400" : ""
                  }`
                }
              >
                request
              </NavLink>
            </h3>
            {/* <h3
              className="flex items-center justify-between hover:underline cursor-pointer"
              onClick={() => {
                setNav(false);
              }}
            >
              <NavLink
                to="/main/dashboard/software"
                className={({ isActive }) =>
                  `hover:underline cursor-pointer ${
                    isActive ? "text-blue-400" : ""
                  }`
                }
              >
                software
              </NavLink>
            </h3> */}
            {/* <h3
              className="flex items-center justify-between hover:underline cursor-pointer"
              onClick={() => {
                setNav(false);
              }}
            >
              <NavLink
                to="/main/dashboard/task"
                className={({ isActive }) =>
                  `hover:underline cursor-pointer ${
                    isActive ? "text-blue-400" : ""
                  }`
                }
              >
                task
              </NavLink>
            </h3> */}
            <h3
              className="flex items-center justify-between hover:underline cursor-pointer"
              onClick={() => {
                setNav(false);
              }}
            >
              <NavLink
                to="/main/dashboard/asset"
                className={({ isActive }) =>
                  `hover:underline cursor-pointer ${
                    isActive ? "text-blue-400" : ""
                  }`
                }
              >
                assets
              </NavLink>
            </h3>
            <h3
              className="flex items-center justify-between hover:underline cursor-pointer"
              onClick={() => {
                setNav(false);
              }}
            >
              <NavLink
                to="/main/dashboard/vendor"
                className={({ isActive }) =>
                  `hover:underline cursor-pointer ${
                    isActive ? "text-blue-400" : ""
                  }`
                }
              >
                vendor
              </NavLink>
            </h3>
          </>
        );
      case "servicedesk":
        return (
          <>
            {/* <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => {setNav(false)}} >incidents</h3> */}
            <h3
              className="flex items-center justify-between hover:underline cursor-pointer"
              onClick={() => {
                setNav(false);
              }}
            >
              <NavLink
                to="/main/ServiceDesk/IndicentData"
                className={({ isActive }) =>
                  `hover:underline cursor-pointer ${
                    isActive ? "text-blue-400" : ""
                  }`
                }
              >
                incidents
              </NavLink>
            </h3>
            <h3
              className="flex items-center justify-between hover:underline cursor-pointer"
              onClick={() => {
                setNav(false);
              }}
            >
              <NavLink
                to="/main/ServiceDesk/TaskAssigned"
                className={({ isActive }) =>
                  `hover:underline cursor-pointer ${
                    isActive ? "text-blue-400" : ""
                  }`
                }
              >
                Task Assigned
              </NavLink>
            </h3>
            <h3
              className="flex items-center justify-between hover:underline cursor-pointer"
              onClick={() => {
                setNav(false);
              }}
            >
              <NavLink
                to="/main/ServiceDesk/new-incidents-assigned"
                className={({ isActive }) =>
                  `hover:underline cursor-pointer ${
                    isActive ? "text-blue-400" : ""
                  }`
                }
              >
                new incidents assigned
              </NavLink>
            </h3>
            <h3
              className="flex items-center justify-between hover:underline cursor-pointer"
              onClick={() => {
                setNav(false);
              }}
            >
              <NavLink
                to="/main/ServiceDesk/service-request"
                className={({ isActive }) =>
                  `hover:underline cursor-pointer ${
                    isActive ? "text-blue-400" : ""
                  }`
                }
              >
                service request
              </NavLink>
            </h3>
            {/* <h3
              className="flex items-center justify-between hover:underline cursor-pointer"
              onClick={() => {
                setNav(false);
              }}
            >
              tasks
            </h3> */}
            <h3
              className="flex items-center justify-between hover:underline cursor-pointer"
              onClick={() => {
                setNav(false);
              }}
            >
              <NavLink
                to="/main/ServiceDesk/AllVendors"
                className={({ isActive }) =>
                  `hover:underline cursor-pointer ${
                    isActive ? "text-blue-400" : ""
                  }`
                }
              >
                vendors
              </NavLink>
            </h3>
            {/* <h3
              className="flex items-center justify-between hover:underline cursor-pointer"
              onClick={() => {
                setNav(false);
              }}
            >
              knowledge base
            </h3>
            <h3
              className="flex items-center justify-between hover:underline cursor-pointer"
              onClick={() => {
                setNav(false);
              }}
            >
              documents
            </h3> */}
          </>
        );
      case "assets":
        return (
          <>
            <h3
              className="flex items-center justify-between hover:underline cursor-pointer"
              onClick={() => {
                toggleSubMenu("assets");
              }}
            >
              assets{" "}
              {expandedSubMenus.assets ? (
                <IoMdArrowDropdown />
              ) : (
                <IoMdArrowDropright />
              )}
            </h3>
            {expandedSubMenus.assets && (
              <ul className="flex flex-col gap-2 list-disc pl-5 ">
                <li
                  className="text-[11px] hover:underline"
                  onClick={() => {
                    setNav(false);
                  }}
                >
                  <NavLink
                    to="/main/asset/AssetData"
                    className={({ isActive }) =>
                      `hover:underline cursor-pointer ${
                        isActive ? "text-blue-400" : ""
                      }`
                    }
                  >
                    Manage
                  </NavLink>
                </li>
                <li
                  className="text-[11px] hover:underline"
                  onClick={() => {
                    setNav(false);
                  }}
                >
                  <NavLink
                    to="/main/asset/assets-summary"
                    className={({ isActive }) =>
                      `hover:underline cursor-pointer ${
                        isActive ? "text-blue-400" : ""
                      }`
                    }
                  >
                    summary
                  </NavLink>
                </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/Asset/asset-import"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      assets import
                    </NavLink>
                  </li>
              </ul>
            )}
            {/* <h3
              className="flex items-center justify-between hover:underline cursor-pointer"
              onClick={() => {
                setNav(false);
              }}
            >
              preventive
            </h3> */}
            <h3
              className="flex items-center justify-between hover:underline cursor-pointer"
              onClick={() => {
                setNav(false);
              }}
            >
              <NavLink
                to="/main/Asset/GatePassData"
                className={({ isActive }) =>
                  `hover:underline cursor-pointer ${
                    isActive ? "text-blue-400" : ""
                  }`
                }
              >
                gate pass
              </NavLink>
            </h3>
          </>
        );
      case "reports":
        if (
          userData.userRole === "Super Admin" ||
          userData.userRole === "Admin"
        ) {
          return (
            <>
              <h3
                className="flex items-center justify-between hover:underline cursor-pointer"
                onClick={() => {
                  setNav(false);
                }}
              >
                <NavLink
                  to="/main/dashboard/AuditReport"
                  className={({ isActive }) =>
                    `hover:underline cursor-pointer ${
                      isActive ? "text-blue-400" : ""
                    }`
                  }
                >
                  Audit Report
                </NavLink>
              </h3>
            </>
          );
        }
      case "configuration":
        if (userData.userRole === "Super Admin") {
          return (
            <>
              <h3
                className="flex items-center justify-between hover:underline cursor-pointer"
                onClick={() => toggleSubMenu("global")}
              >
                global
                {expandedSubMenus.global ? (
                  <IoMdArrowDropdown />
                ) : (
                  <IoMdArrowDropright />
                )}
              </h3>
              {expandedSubMenus.global && (
                <ul className="flex flex-col gap-2 list-disc pl-5 ">
                  {/* {console.log(userData)} */}
                    <li
                      className="text-[11px] hover:underline"
                      onClick={() => {
                        setNav(false);
                      }}
                    >
                      <NavLink
                        to="/main/configuration/Users"
                        className={({ isActive }) =>
                          `hover:underline cursor-pointer ${
                            isActive ? "text-blue-400" : ""
                          }`
                        }
                      >
                        Users
                      </NavLink>
                    </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/components"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      components
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/department"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      Department
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/sub-department"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      Sub Department
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/location"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      Location
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/sub-location"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      Sub Location
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/import-user"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      Import User
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/supportDepartment"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      Support Department
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/supportGroup"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      Support Group
                    </NavLink>
                  </li>
                </ul>
              )}
              <h3
                className="flex items-center justify-between hover:underline cursor-pointer"
                onClick={() => toggleSubMenu("incidents")}
              >
                incidents{" "}
                {expandedSubMenus.incidents ? (
                  <IoMdArrowDropdown />
                ) : (
                  <IoMdArrowDropright />
                )}
              </h3>
              {expandedSubMenus.incidents && (
                <ul className="flex flex-col gap-2 list-disc pl-5 ">
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/IncidentStatus"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      Incident Status
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/AutoCloseTime"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      Auto Close Time
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/CloserCode"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      Closer Code
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/PredefinedReplies"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      Predefined Replies
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/PendingReason"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      Pending Reason
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/Category"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      category
                    </NavLink>
                  </li>
                  {/* <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >category</li> */}
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/SubCategory"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      sub category
                    </NavLink>
                  </li>
                  {/* <li className='text-[11px] hover:underline' onClick={() => {setNav(false)}} >sub category</li> */}
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/IncidentRules"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      rules
                    </NavLink>
                  </li>
                  {/* <li
                  className="text-[11px] hover:underline"
                  onClick={() => {
                    setNav(false);
                  }}
                >
                  escalatio level
                </li> */}
                </ul>
              )}

              <h3
                className="flex items-center justify-between hover:underline cursor-pointer"
                onClick={() => toggleSubMenu("sla")}
              >
                sla{" "}
                {expandedSubMenus.sla ? (
                  <IoMdArrowDropdown />
                ) : (
                  <IoMdArrowDropright />
                )}
              </h3>
              {expandedSubMenus.sla && (
                <ul className="flex flex-col gap-2 list-disc pl-5 ">
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/sla-creation"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      sla creation
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/sla-mapping"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      sla mapping
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/sla-time-lines"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      sla timelines
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/priority-matrix"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      priority matix
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/holiday-calendar"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      holiday calendar
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/holiday-list"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      holiday list
                    </NavLink>
                  </li>
                </ul>
              )}

              <h3
                className="flex items-center justify-between hover:underline cursor-pointer"
                onClick={() => toggleSubMenu("request")}
              >
                request{" "}
                {expandedSubMenus.request ? (
                  <IoMdArrowDropdown />
                ) : (
                  <IoMdArrowDropright />
                )}
              </h3>
              {expandedSubMenus.request && (
                <ul className="flex flex-col gap-2 list-disc pl-5 ">
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/ReqAutoClosedTime"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      auto closed time
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/ReqCategory"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      category
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/ReqSubCategory"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      sub category
                    </NavLink>
                  </li>
                </ul>
              )}

              <h3
                className="flex items-center justify-between hover:underline cursor-pointer"
                onClick={() => toggleSubMenu("asset")}
              >
                asset{" "}
                {expandedSubMenus.asset ? (
                  <IoMdArrowDropdown />
                ) : (
                  <IoMdArrowDropright />
                )}
              </h3>
              {expandedSubMenus.asset && (
                <ul className="flex flex-col gap-2 list-disc pl-5 ">
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/software-category"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      Software Category
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/software-name"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      Software Name
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/publisher"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      Publisher
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/store-location"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      Store Location
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/condition"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      Condition
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/consumable-category"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      Consumable Category
                    </NavLink>
                  </li>
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/consumable-sub-category"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      Consumable SubCategory
                    </NavLink>
                  </li>
                  {/* <li
                  className="text-[11px] hover:underline"
                  onClick={() => {
                    setNav(false);
                  }}
                >
                  <NavLink
                    to="/main/configuration/asset-tag"
                    className={({ isActive }) =>
                      `hover:underline cursor-pointer ${
                        isActive ? "text-blue-400" : ""
                      }`
                    }
                  >
                    Asset Tag
                  </NavLink>
                </li> */}
                </ul>
              )}
              <h3
                className="flex items-center justify-between hover:underline cursor-pointer"
                onClick={() => toggleSubMenu("gatepass")}
              >
                Gate Pass{" "}
                {expandedSubMenus.gatepass ? (
                  <IoMdArrowDropdown />
                ) : (
                  <IoMdArrowDropright />
                )}
              </h3>
              {expandedSubMenus.gatepass && (
                <ul className="flex flex-col gap-2 list-disc pl-5 ">
                  <li
                    className="text-[11px] hover:underline"
                    onClick={() => {
                      setNav(false);
                    }}
                  >
                    <NavLink
                      to="/main/configuration/GatePassAddress"
                      className={({ isActive }) =>
                        `hover:underline cursor-pointer ${
                          isActive ? "text-blue-400" : ""
                        }`
                      }
                    >
                      Gate Pass Address
                    </NavLink>
                  </li>
                </ul>
              )}
              {/* <h3
              className="flex items-center justify-between hover:underline cursor-pointer"
              onClick={() => {
                setNav(false);
              }}
            >
              gate pass
            </h3> */}
              {/* <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => {setNav(false)}} >vendor</h3> */}
              {/* <h3 className='flex items-center justify-between hover:underline cursor-pointer' onClick={() => {setNav(false)}} >license</h3> */}
            </>
          );
        }
        return null;
      default:
        return null;
    }
  };


  return (
    <div className="flex h-full">
      <div className="w-fit h-[calc(100vh-3.5rem)] p-5 flex flex-col gap-8 text-2xl bg-gray-800 text-white">
        <RxDashboard
          title="Dashboard"
          className={`${
            activeMenu == "dashboard" ? "text-blue-400" : ""
          } cursor-pointer`}
          onClick={() => {
            setActiveMenu("dashboard");
            setNav(true);
          }}
        />
        <LiaToolsSolid
          title="Service Desk"
          className={`${
            activeMenu == "servicedesk" ? "text-blue-400" : ""
          } cursor-pointer`}
          onClick={() => {
            setActiveMenu("servicedesk");
            setNav(true);
          }}
        />
        <GrCubes
          title="Assets"
          className={`${
            activeMenu == "assets" ? "text-blue-400" : ""
          } cursor-pointer`}
          onClick={() => {
            setActiveMenu("assets");
            setNav(true);
          }}
        />
        {(userData.userRole === "Super Admin" ||
          userData.userRole === "Admin") && (
          <TbReportSearch
            title="Reports"
            className={`${
              activeMenu == "reports" ? "text-blue-400" : ""
            } cursor-pointer`}
            onClick={() => {
              setActiveMenu("reports");
              setNav(true);
            }}
          />
        )}
        {userData.userRole === "Super Admin" && (
          <MdOutlineAdminPanelSettings
            title="Configuration"
            className={`${
              activeMenu == "configuration" ? "text-blue-400" : ""
            } cursor-pointer`}
            onClick={() => {
              setActiveMenu("configuration");
              setNav(true);
            }}
          />
        )}
      </div>

      <div
        className={`w-40 h-[calc(100vh-3.5rem)] p-7 text-xs flex flex-col gap-3 bg-gray-900 text-white uppercase overflow-y-auto ${
          nav ? "" : "hidden"
        } `}
      >
        {renderSubMenu()}
      </div>
    </div>
  );
};

export default Navigation;
