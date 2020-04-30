dataSrcIP = process.env.DATASRC_IP;
protocol = 'http';
domain = `${protocol}://${dataSrcIP}`;

module.exports = {

    trackingData: `${domain}/data/trackingData`,

    lbeacon: `${domain}/data/lbeacon`,

    gateway: `${domain}/data/gateway`,

    user: `${domain}/data/user`,

    userInfo: {
        area: {
            secondary: `${domain}/data/user/area/secondary`,
        },
        password: `${domain}/data/user/password`
    },

    object: `${domain}/data/object`,

    importedObject: `${domain}/data/importedObject`,

    locationHistory: `${domain}/data/locationHistory`,

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

