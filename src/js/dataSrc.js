const hostIP = process.env.HOST_IP;
const protocol = 'https';
const domain = `${protocol}://${hostIP}`;
const getTrackingData = `${protocol}://${hostIP}/data/getTrackingData`;
const getTrackingTableByMacAddress = `${protocol}://${hostIP}/data/getTrackingTableByMacAddress`;
const getGatewayTable = `${protocol}://${hostIP}/data/getGatewayTable`;
const searchResult = `${protocol}://${hostIP}/data/searchResult`;
const editObject = `${protocol}://${hostIP}/data/editObject`;
const setLocaleID = `${protocol}://${hostIP}/data/setLocaleID`;
const editImport = `${protocol}://${hostIP}/data/editImport`;
const editPatient = `${protocol}://${hostIP}/data/editPatient`;
const addObject = `${protocol}://${hostIP}/data/addObject`;
const getImportTable = `${protocol}://${hostIP}/data/getImportTable`;
const getImportData = `${protocol}://${hostIP}/data/getImportData`;
const addAssociation = `${protocol}://${hostIP}/data/addAssociation`;
const addAssociation_Patient = `${protocol}://${hostIP}/data/addAssociation_Patient`;
const cleanBinding = `${protocol}://${hostIP}/data/cleanBinding`;
const editObjectPackage = `${protocol}://${hostIP}/data/editObjectPackage`;
const signin = `${protocol}://${hostIP}/user/signin`;
const editPassword = `${protocol}://${hostIP}/user/editPassword`; 
const getUserInfo = `${protocol}://${hostIP}/user/getUserInfo`;
const addUserSearchHistory = `${protocol}://${hostIP}/user/addUserSearchHistory`;
const modifyMyDevice = `${protocol}://${hostIP}/data/modifyMyDevice`;
const modifyUserInfo = `${protocol}://${hostIP}/data/modifyUserInfo`;
const generatePDF = `${protocol}://${hostIP}/data/generatePDF`;
const getShiftChangeRecord = `${protocol}://${hostIP}/data/PDFInfo`;
const validateUsername = `${protocol}://${hostIP}/validation/username`;
const getEditObjectRecord = `${protocol}://${hostIP}/test/getEditObjectRecord`;
const deleteEditObjectRecord = `${protocol}://${hostIP}/test/deleteEditObjectRecord`
const deleteShiftChangeRecord = `${protocol}://${hostIP}/test/deleteShiftChangeRecord`
const deletePatient = `${protocol}://${hostIP}/test/deletePatient`
const deleteImportData = `${protocol}://${hostIP}/test/deleteImportData`
const deleteGateway= `${protocol}://${hostIP}/test/deleteGateway`
const getRoleNameList = `${protocol}://${hostIP}/test/getRoleNameList`
const getAreaTable = `${protocol}://${hostIP}/data/getAreaTable`
const getGeofenceConfig = `${protocol}://${hostIP}/data/getGeofenceConfig`
const setGeofenceConfig = `${protocol}://${hostIP}/data/setGeofenceConfig`
const addShiftChangeRecord = `${protocol}://${hostIP}/data/addShiftChangeRecord`
const checkoutViolation = `${protocol}://${hostIP}/data/checkoutViolation`
const confirmValidation = `${protocol}://${hostIP}/data/confirmValidation`
const getMonitorConfig = `${protocol}://${hostIP}/data/getMonitorConfig`
const setMonitorConfig = `${protocol}://${hostIP}/data/setMonitorConfig`
const addMonitorConfig = `${protocol}://${hostIP}/data/addMonitorConfig`
const addGeofenceConfig = `${protocol}://${hostIP}/data/addGeofenceConfig`
const deleteMonitorConfig = `${protocol}://${hostIP}/data/deleteMonitorConfig`
const backendSearch = `${protocol}://${hostIP}/data/backendSearch`
const getSearchQueue = `${protocol}://${hostIP}/data/getSearchQueue`
const objectImport = `${protocol}://${hostIP}/data/objectImport`
const pinImage = `${protocol}://${hostIP}/image/pinImage`
const getTransferredLocation = `${protocol}://${hostIP}/data/getTransferredLocation`
const modifyTransferredLocation= `${protocol}://${hostIP}/data/modifyTransferredLocation`
const setMonitorEnable = `${protocol}://${hostIP}/data/setMonitorEnable`
const getRolesPermission= `${protocol}://${hostIP}/data/getRolesPermission`
const modifyPermission= `${protocol}://${hostIP}/data/modifyPermission`
const modifyRolesPermission= `${protocol}://${hostIP}/data/modifyRolesPermission`
const getLocationHistory = `${protocol}://${hostIP}/data/getLocationHistory`
const setUserSecondaryArea = `${protocol}://${hostIP}/data/setUserSecondaryArea`
const addPatientRecord = `${protocol}://${hostIP}/data/addPatientRecord`
const exportCSV = `${protocol}://${hostIP}/exportCSV`
const exportPDF = `${protocol}://${hostIP}/exportPDF`;

const getUrl = url => {
    return domain + url
}
const trackingData = `${domain}/data/trackingData`;
const lbeacon = `${domain}/data/lbeacon`;
const gateway = `${domain}/data/gateway`;
const user = `${domain}/data/user`;
const object = `${domain}/data/object`;
const importedObject = `${domain}/data/importedObject`;
const locationHistory = `${domain}/data/locationHistory`;
const area = `${domain}/data/area`;

// const trackingData = `${protocol}://${hostIP}/data/trackingData`;



const pdfUrl = function (path) {
    return `${protocol}://${hostIP}/${path}`
}
module.exports = {
    trackingData,
    lbeacon,
    gateway,
    user,
    object,
    importedObject,
    locationHistory,
    area,


    domain,
    // getTrackingData,
    getTrackingTableByMacAddress,
    getImportData,
    addAssociation,
    addAssociation_Patient,
    editImport,
    cleanBinding,
    getImportTable,
    getGatewayTable,
    getMonitorConfig,
    getTransferredLocation,
    searchResult,
    editObject,
    setLocaleID,
    deletePatient,
    editPatient,
    addObject,
    editObjectPackage,
    signin,
    editPassword,
    getUserInfo,
    objectImport,
    addUserSearchHistory,
    pdfUrl,
    generatePDF,
    modifyMyDevice,
    modifyUserInfo,
    deleteImportData,
    deleteGateway,
    getShiftChangeRecord,
    validateUsername,    
    getEditObjectRecord,
    deleteEditObjectRecord,
    deleteShiftChangeRecord,
    getRoleNameList,
    getAreaTable,
    getGeofenceConfig,
    setGeofenceConfig,
    addShiftChangeRecord,
    checkoutViolation,
    confirmValidation,
    setMonitorConfig,
    backendSearch,
    getSearchQueue, 
    pinImage,
    addGeofenceConfig,
    deleteMonitorConfig,
    addMonitorConfig,
    modifyTransferredLocation,
    setMonitorEnable,
    modifyTransferredLocation, 
    getRolesPermission,
    modifyPermission,
    modifyRolesPermission,
    getLocationHistory,
    setUserSecondaryArea,
    addPatientRecord,
    exportCSV,
    exportPDF
};
