const rules = {
    guest: {
        permission: [  
            "form:view",
        ],
      
    },
    care_provider: {
        permission: [
            "form:edit",
            "route:devicesManagement",
            "route:patientManagement",
            "route:objectManagement",

            "route:userProfile",
            "route:bigScreen",
            "route:trackingHistory",
            "user:mydevice",
            "user:mypatient",
            "user:shiftChange",
            "user:saveSearchRecord",
            "user:cleanPath",
            "user:toggleShowDevices",
            "user:toggleShowResidents",
            "route:monitorSetting",
            "user:batteryNotice"
        ]
    },
    system_admin: {
        permission: [
            "form:edit",

            "route:systemStatus",
            "route:userProfile",
            "route:objectManagement",
            "route:editObjectManagement",
            "route:userManager",
            "route:shiftChangeRecord",
            "route:rolePermissionManagement",
            "route:transferredLocationManagement",
            "route:trackingHistory",
            "route:monitor",
            "route:report",
            "route:bigScreen",
            "route:management",
            "route:systemSetting",

            "user:mydevice",
            "user:mypatient",
            "user:shiftChange",
            "user:saveSearchRecord",
            "user:cleanPath",
            "user:toggleShowDevices",
            "user:toggleShowResidents",
            "route:monitorSetting",
            "user:importTable",
            "user:batteryNotice"
        ]
    },
    dev: {
        permission: [
            "form:edit",
            "form:develop",
            "route:systemStatus",
            "route:userProfile",
            "route:objectManagement",
            "route:editObjectManagement",
            "route:shiftChangeRecord",
            "route:userManager",
            "route:rolePermissionManagement",
            "route:transferredLocationManagement",
            "route:trackingHistory",
            "route:bigScreen",
            "route:monitor",
            "route:report",
            "route:management",
            "route:systemSetting",


            "user:mydevice",
            "user:mypatient",
            "user:saveSearchRecord",
            "user:cleanPath",
            "user:toggleShowDevices",
            "user:toggleShowResidents",
            "user:importTable",
            "user:batteryNotice",
            "user:shiftChange",
        ]
    }
  };
  
  export default rules;
