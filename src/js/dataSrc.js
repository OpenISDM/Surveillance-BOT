dataSrcIP = process.env.DATASRC_IP;
dataSrcProtocol = process.env.DATASRC_PROTOCOL || 'https'
domain = `${dataSrcProtocol}://${dataSrcIP}`;

module.exports = {

    trackingData: `${domain}/data/trackingData`,

    lbeacon: `${domain}/data/lbeacon`,

    gateway: `${domain}/data/gateway`,

    user: `${domain}/data/user`,

    userInfo: {
        area: {
            secondary: `${domain}/data/user/area/secondary`,
        },
        password: `${domain}/data/user/password`,
        locale: `${domain}/data/user/locale`,
    },

    object: `${domain}/data/object`,

    importedObject: `${domain}/data/importedObject`,

    trace: {
        locationHistory: `${domain}/data/trace/locationHistory`,
       
        contactTree: `${domain}/data/trace/contactTree`,
    },

    area: `${domain}/data/area`,

    role: `${domain}/data/role`,

    auth: {
        signin: `${domain}/data/auth/signin`,
        signout: `${domain}/data/auth/signout`,
    },

    file: {
        export: {
            csv: `${domain}/data/file/export/csv`,
            pdf: `${domain}/data/file/export/pdf`,
        }
    },

    pdfUrl: path => {
        return `${domain}/data/file/${path}`
    }
}

