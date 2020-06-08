/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        searchFilter.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every 
        LBeacon are retrieved from BeDIS (Building/environment Data and Information 
        System) and stored locally during deployment and maintenance times. Once 
        initialized, each LBeacon broadcasts its coordinates and location 
        description to Bluetooth enabled user devices within its coverage area. It 
        also scans Bluetooth low-energy devices that advertise to announced their 
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/


filterData = (data, key, filteredAttribute) => {
                    
    this.setState({
        loadingFlag:  true
    })
    const { locale } = this.context  
    key = key.toLowerCase()
    let filteredData = data.filter(obj => { 
        if(filteredAttribute.includes('name')){

            let keyRex = new RegExp(key)
            if(obj.name.toLowerCase().match(keyRex)){
                return true
            }
        }
        if(filteredAttribute.includes('type')){

            let keyRex = new RegExp(key)
            
            if(obj.type.toLowerCase().match(keyRex)){
                return true
            }
        }

        if(filteredAttribute.includes('acn')){
            let keyRex = new RegExp(key)
            if(obj.asset_control_number.toLowerCase().match(keyRex)) return true

        }

        if  (filteredAttribute.includes('status')){
            
            let keyRex = new RegExp(key.toLowerCase())

            if(obj.status.label.toLowerCase().match(keyRex)){
                return true
            }
        }

        if (filteredAttribute.includes('area')){ 
            let keyRex = new RegExp(key) 
            if (obj.area_name.label != undefined){
                if (obj.area_name.label.match(keyRex)) {
                   return true 
                }
            } 
        }

        if (filteredAttribute.includes('monitor')){
            let keyRex = new RegExp(key)
            if(obj.monitor_type.toLowerCase().match(keyRex)){
                return true
            }
        }

        if  (filteredAttribute.includes('macAddress')){

            let keyRex = key.replace(/:/g, '')
            if (obj.mac_address.replace(/:/g, '').toLowerCase().match(keyRex)) return true
        }

        if(filteredAttribute.includes('sex')){
           
            if (obj.object_type == key){
                return true
            }
        }

        if(filteredAttribute.includes('physician_name')){
          
            let keyRex = new RegExp(key)

            if (obj.physician_name && obj.physician_name.toLowerCase().match(keyRex)){
                return true
            } 
        }

        return false
    })
    this.setState({ loadingFlag:  false })
    return filteredData
    
}

addObjectFilter = (key, attribute, source) => {

    this.state.objectFilter = this.state.objectFilter.filter(filter => source != filter.source)
    
    this.state.objectFilter.push({
        key, attribute, source
    })
    this.filterObjects()
}

removeObjectFilter = (source) => {
    this.state.objectFilter = this.state.objectFilter.filter(filter => source != filter.source)
    this.filterObjects()
}

filterObjects = () => {
    let filteredData = this.state.objectFilter.reduce((acc, curr) => {
        return this.filterData(acc, curr.key, curr.attribute)
    }, this.state.data)

    this.setState({
        filteredData
    })
}

addPatientFilter = (key, attribute, source) => {
    this.state.patientFilter = this.state.patientFilter.filter(filter => source != filter.source)
    this.state.patientFilter.push({
        key, attribute, source
    }) 
   
    this.filterPatients()
}

removePatientFilter = (source) => {
    this.state.patientFilter = this.state.patientFilter.filter(filter => source != filter.source)
    this.filterPatients()
}

filterPatients = () => {
    let filteredPatient = this.state.patientFilter.reduce((acc, curr) => {
        return this.filterData(acc, curr.key, curr.attribute)
    }, this.state.dataPatient)
    this.setState({
        filteredPatient
    }) 
}

export default {
    addObjectFilter
}