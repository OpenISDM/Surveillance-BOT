import React from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import '../../service/leafletAwesomeNumberMarkers';
import _ from 'lodash'
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import dataSrc from '../../dataSrc';
import siteConfig from '../../../../site_module/siteConfig';
import polylineDecorator from 'leaflet-polylinedecorator';
import {
    BrowserView,
    TabletView,
    MobileOnlyView,
    isMobileOnly,
    isBrowser,
    isTablet,
} from 'react-device-detect'
import {
    macAddressToCoordinate
} from '../../service/dataTransfer'

class Map extends React.Component {
    
    static contextType = AppContext

    state = {
        objectInfo: [],
    }

    map = null;
    image = null;
    pathOfDevice = L.layerGroup();
    markersLayer = L.layerGroup();
    errorCircle = L.layerGroup();
    lbeaconsPosition = L.layerGroup();
    geoFenceLayer = L.layerGroup()
    locationMonitorLayer = L.layerGroup()
    currentZoom = 0
    prevZoom = 0
    pin_shift_scale = [500, -400]
    iconOption = {};
    mapOptions = {};

    componentDidMount = () => {
        this.initMap();
    }

    componentDidUpdate = (prevProps) => {
        
        this.handleObjectMarkers();
        //this.drawPolyline();

        if (parseInt(process.env.IS_LBEACON_MARK) && !(_.isEqual(prevProps.lbeaconPosition, this.props.lbeaconPosition))) {
            this.createLbeaconMarkers(this.props.lbeaconPosition, this.lbeaconsPosition)
        }

        if (!(_.isEqual(prevProps.geofenceConfig, this.props.geofenceConfig))) {
            this.createGeofenceMarkers()
        }

        if (!(_.isEqual(prevProps.locationMonitorConfig, this.props.locationMonitorConfig))) {
            this.createLocationMonitorMarkers()
        }
        if(!(_.isEqual(prevProps.pathMacAddress, this.props.pathMacAddress))){
            this.drawPolyline();
        }

        if (prevProps.areaId !== this.props.areaId) { 
            this.setMap()
        }
    }

    /** Set the search map configuration establishing in config.js  */
    initMap = () => {
        let [{areaId}] = this.context.stateReducer

        let {
            mapConfig
        } = this.props

        let { 
            areaOptions,
            defaultAreaId,
        } = mapConfig

        let {
            areaModules
        } = siteConfig


        if (isBrowser) {
            this.mapOptions = mapConfig.browserMapOptions
            this.iconOptions = mapConfig.iconOptions

        } else if (isTablet) {
            this.mapOptions = mapConfig.tabletMapOptions
            this.iconOptions = mapConfig.iconOptionsInTablet

        } else if (isMobileOnly) {
            this.mapOptions = mapConfig.mobileMapOptions
            this.iconOptions = mapConfig.iconOptionsInMobile
        }

        /** Error handler of the user's auth area does not include the group of sites */
        let areaOption = areaOptions[areaId] || areaOptions[defaultAreaId] || Object.values(areaOptions)[0]

        /** set the map's config */
        let { 
            url, 
            bounds,
            hasMap
        } = areaModules[areaOption]
        this.mapOptions.maxBounds = bounds.map((latLng, index) => latLng.map(axis => axis + this.mapOptions.maxBoundsOffset[index]))
        var map = L.map('mapid', this.mapOptions);

        if (hasMap) {
            let image = L.imageOverlay(url, bounds);
            map.addLayer(image)
            map.fitBounds(bounds);
            this.image = image
            this.map = map;
        } else {
            let image = L.imageOverlay(null, null);
            this.image = image
            map.addLayer(image)
            this.map = map;
        }

        // this.originalZoom = this.map.getZoom()
        // this.currentZoom = this.map.getZoom();
        // this.prevZoom = this.map.getZoom();
        
        /** Set the map's events */
        // this.map.on('zoomend', this.resizeMarkers)
    }

    /** Set the overlay image when changing area */
    setMap = () => {
        let [{areaId}] = this.context.stateReducer

        let {
            areaModules
        } = siteConfig

        let { 
            areaOptions,
            defaultAreaId,
            mapOptions
        } = this.props.mapConfig

        /** Error handler of the user's auth area does not include the group of sites */
        let areaOption = areaOptions[areaId] || areaOptions[defaultAreaId] || Object.values(areaOptions)[0]

        /** set the map's config */
        let { 
            url, 
            bounds,
            hasMap
        } = areaModules[areaOption]
        mapOptions.maxBounds = bounds.map((latLng, index) => latLng.map(axis => axis + mapOptions.maxBoundsOffset[index]))
        if (hasMap) {
            this.image.setUrl(url)
            this.image.setBounds(bounds)
            this.map.fitBounds(bounds)  
        } else {
            this.image.setUrl(null)
        }   
    }

    /** Resize the markers and errorCircles when the view is zoomend. */
    resizeMarkers = () => {
        this.prevZoom = this.currentZoom
        this.currentZoom = this.map.getZoom();
        // this.calculateScale();
        this.markersLayer.eachLayer(marker => {
            let icon = marker.options.icon;
            icon.options.iconSize = [this.scalableIconSize, this.scalableIconSize]
            icon.options.numberSize = this.scalableNumberSize
            icon.options.iconAnchor = [this.scalableIconSize / 2, this.scalableIconSize / 2]
            var pos = marker.getLatLng()
            marker.setLatLng([
                pos.lat - this.prevZoom * this.pin_shift_scale[0] + this.currentZoom * this.pin_shift_scale[0], 
                pos.lng - this.prevZoom * this.pin_shift_scale[1] + this.currentZoom * this.pin_shift_scale[1]
            ])
            marker.setIcon(icon);
        })

        this.geoFenceLayer.eachLayer( circle => {
            circle.setRadius(this.scalableCircleRadius)
        })

    }

    /** Calculate the current scale for creating markers and resizing. */
    calculateScale = () => {
        
        this.minZoom = this.map.getMinZoom();
        this.zoomDiff = this.currentZoom - this.minZoom;
        this.resizeFactor = Math.pow(2, (this.zoomDiff));
        this.resizeConst = Math.floor(this.zoomDiff * 20);

        if (isBrowser) {
            this.scalableIconSize = parseInt(this.props.mapConfig.iconOptions.iconSize) + this.resizeConst
            this.scalableCircleRadius = parseInt(this.props.mapConfig.iconOptions.circleRadius) * this.resizeFactor
            this.scalableNumberSize = this.scalableIconSize / 3;

        } else if (isTablet) {
            this.scalableIconSize = parseInt(this.props.mapConfig.iconOptions.iconSizeForTablet) + this.resizeConst
            this.scalableCircleRadius = parseInt(this.props.mapConfig.iconOptions.circleRadiusForTablet) * this.resizeFactor
            this.scalableNumberSize = Math.floor(this.scalableIconSize / 3);

        } else if (isMobileOnly) {
            this.scalableIconSize = parseInt(this.props.mapConfig.iconOptionsInMobile.iconSize) + this.resizeConst
            this.scalableCircleRadius = parseInt(this.props.mapConfig.iconOptionsInMobile.circleRadius) * this.resizeFactor
            this.scalableNumberSize = this.scalableIconSize / 3;
        }
    }

    /** init path */
    drawPolyline = () => {

        this.pathOfDevice.clearLayers();
        if(this.props.pathMacAddress !== ''){

            let route = []

            axios.post(dataSrc.getTrackingTableByMacAddress, {
                object_mac_address : this.props.pathMacAddress
            })
            .then(res => {

                var preUUID = ''
                res.data.rows.map(item => {
                    
                    if(item.uuid != preUUID){
                        preUUID = item.uuid;
                        let latLng = [item.base_y, item.base_x]

                        /** Calculate the position of the object  */
                        let pos = macAddressToCoordinate(
                            item.mac_address, 
                            latLng,
                            this.props.mapConfig.iconOptions.markerDispersity
                        );
                        var marker = L.circleMarker(pos, {radius:3,color:'lightgrey'});
                        
                        this.pathOfDevice.addLayer(marker)
                        route.push(pos)
                    }
                })
                var polyline = L.polyline(route,{
                    color: 'black',
                    dashArray: '1,1'
                })

                var decorator = L.polylineDecorator(polyline, {
                    patterns: [
                        {
                            offset: '100%',
                            repeat: 0,
                            symbol: L.Symbol.arrowHead({
                                weight: 3,
                                pixelSize: 10,
                                polygon: false,
                                pathOptions: {
                                    color: 'black',
                                    stroke:true
                                }
                            })
                        }
                    ]
                })
                this.pathOfDevice.addLayer(polyline)
                this.pathOfDevice.addLayer(decorator)
                this.pathOfDevice.addTo(this.map)
            })
            .catch(err => {
                console.log(`get tracking table by mac address failed ${err}`)
            })
        }
    }

    /** Create the geofence-related lbeacons markers */
    createGeofenceMarkers = () => {     
        let {
            geofenceConfig,
        } = this.props

        let {
            stateReducer
        } = this.context

        // this.calculateScale()

        let [{areaId}] = stateReducer

        this.geoFenceLayer.clearLayers()

        /** Create the markers of lbeacons of perimeters and fences
         *  and onto the map  */
        if (geofenceConfig[areaId] && geofenceConfig[areaId].enable) {
            ['parsePerimeters', 'parseFences'].map(type => {
                geofenceConfig[areaId].rules.map(rule => {
                    if (rule.is_active) {
                        rule[type].coordinates.map(item => {
                            L.circleMarker(item, this.iconOptions.geoFenceMarkerOptions).addTo(this.geoFenceLayer);
                            
                        })  
                    }
                })
            })
        }
        
        /** Add the new markerslayers to the map */
        this.geoFenceLayer.addTo(this.map);
    }

    /** Create the geofence-related lbeacons markers */
    createLocationMonitorMarkers = () => {     
        let {
            locationMonitorConfig,
        } = this.props
        let {
            stateReducer
        } = this.context

        let [{areaId}] = stateReducer
        
        this.locationMonitorLayer.clearLayers()
        /** Create the markers of lbeacons of perimeters and fences
         *  and onto the map  */
        if (locationMonitorConfig[areaId] 
            && locationMonitorConfig[areaId].enable 
            && locationMonitorConfig[areaId].rule.is_active) {
            this.createLbeaconMarkers(
                locationMonitorConfig[areaId].rule.lbeacons,
                this.locationMonitorLayer
            )                            
        }
    }

    /** Create the lbeacon and invisibleCircle markers */
    createLbeaconMarkers = (parseUUIDArray, layer) => {

        let {
            stateReducer
        } = this.context
        let [{areaId}] = stateReducer

        // this.calculateScale()

        /** Creat the marker of all lbeacons onto the map  */
        parseUUIDArray
            .filter(pos => parseInt(pos.split(',')[2]) == areaId)
            .map(pos => {

            let latLng = pos.split(',')
            let lbeacon = L.circleMarker(latLng, this.iconOptions.lbeaconMarkerOptions).addTo(layer);
            // invisibleCircle.on('mouseover', this.handlemenu)
            // invisibleCircle.on('mouseout', function() {this.closePopup();})
        })

        /** Add the new markerslayers to the map */
        layer.addTo(this.map);
    }
    
    /**
     * When user click the coverage of one lbeacon, it will retrieve the object data from this.state.pbjectInfo.
     * It will use redux's dispatch to transfer datas, including isObjectListShown and selectObjectList
     * @param e the object content of the mouse clicking. 
     */
    handlemenu = (e) => {
        const { objectInfo } = this.state
        const lbeacon_coorinate = Object.values(e.target._latlng).toString();
        let objectList = [], key;
        for (key in objectInfo) {
            if (objectInfo[key].lbeacon_coordinate.toString() == lbeacon_coorinate) {
                objectList.push(objectInfo[key])
            }
        }
        if (objectList.length !== 0) {
            const popupContent = this.popupContent(objectList)
            e.target.bindPopup(popupContent, this.props.mapConfig.popupOptions).openPopup();
        }

        this.props.isObjectListShownProp(true);
        this.props.selectObjectListProp(objectList);
    }

    
    /**
     * When handleTrackingData() is executed, handleObjectMarkes() will be called. That is, 
     * once the component is updated, handleObjectMarkers() will be executed.
     * Clear the old markersLayer.
     * Add the markers into this.markersLayer.
     * Create the markers' popup, and add into this.markersLayer.
     * Create the popup's event.
     * Create the error circle of markers, and add into this.markersLayer.
     */
    handleObjectMarkers = () => {
        let { locale } = this.context

        /** Clear the old markerslayers. */
        this.prevZoom = this.originalZoom;
        this.markersLayer.clearLayers();
        this.errorCircle .clearLayers();

        /** Mark the objects onto the map  */
        // this.calculateScale();

        // const iconSize = [this.scalableIconSize, this.scalableIconSize];
        // const numberSize = this.scalableNumberSize;
        let counter = 0;
        this.filterTrackingData(_.cloneDeep(this.props.proccessedTrackingData))
        .map((item, index)  => {

            /** Calculate the position of the object  */
            let position = macAddressToCoordinate(
                item.mac_address, 
                item.currentPosition, 
                this.props.mapConfig.iconOptions.markerDispersity
            );


            /** Set the Marker's popup 
             * popupContent (objectName, objectImg, objectImgWidth)
             * More Style sheet include in Map.css */
            let popupContent = this.props.mapConfig.getPopupContent([item], this.collectObjectsByLatLng(item.lbeacon_coordinate), locale)
            
            /** Set the icon option*/
            item.iconOption = {

                ...this.iconOptions,

                /** Set the pin color */
                markerColor: this.props.mapConfig.getIconColor(item, this.props.colorPanel),

                /** Set the pin size */
                // iconSize,

                /** Insert the object's mac_address to be the data when clicking the object's marker */
                macAddress: item.mac_address,

                lbeacon_coordinate: item.lbeacon_coordinate,

                currentPosition: item.currentPosition,

                /** Set the ordered number on location pin */
                number: this.props.mapConfig.iconOptions.showNumber && item.searched 
                            ? ++counter
                            : '',

                /** Set the color of the ordered number */
                numberColor: this.props.mapConfig.iconColor.number,
            }

            const option = new L.AwesomeNumberMarkers (item.iconOption)
            let marker = L.marker(position, {icon: option}).bindPopup(popupContent, this.props.mapConfig.popupOptions).openPopup();
            marker.addTo(this.markersLayer)

            /** Set the z-index offset of the searhed object so that
             * the searched object icon will be on top of all others */
            if (item.searched || item.panic) marker.setZIndexOffset(1000);
        
            /** Set the marker's event. */
            marker.on('mouseover', function () { this.openPopup(); })
            // marker.on('click', this.handleMarkerClick);
            // marker.on('mouseout', function () { this.closePopup(); })
        })
        /** Add the new markerslayers to the map */
        this.markersLayer.addTo(this.map);
        this.errorCircle .addTo(this.map);
    }

    /** Fire when clicing marker */
    handleMarkerClick = (e) => {
        const lbPosition =  e.target.options.icon.options.lbeacon_coordinate
        this.props.getSearchKey('objects', null, lbPosition, )
    }

    /** Filter out undesired tracking data */
    filterTrackingData = (proccessedTrackingData) => {
        return proccessedTrackingData.filter(item => {
            return (
                item.found && 
                item.isMatchedObject && 
                (   this.props.searchedObjectType.includes(parseInt(item.object_type)) ||
                    this.props.searchedObjectType.includes(parseInt(item.searchedType))
                )
            )
        })
    }

    collectObjectsByLatLng = (lbPosition) => {
        let objectList = []
        this.filterTrackingData(this.props.proccessedTrackingData)
            .map(item => {
                item.lbeacon_coordinate && 
                item.lbeacon_coordinate.toString() === lbPosition.toString() 
                && item.isMatchedObject 
                    ? objectList.push(item) 
                    : null;
            })

        return objectList 
    }
    
    render(){
        return(
            <div>
                <BrowserView>   
                    <div id='mapid' style={{height:'80vh'}}></div>
                </BrowserView>
                <TabletView>
                    <div id='mapid' style={{height:'40vh'}}></div>
                </TabletView>
                <MobileOnlyView>
                    <div id='mapid' style={{height: '28vh'}}></div>
                </MobileOnlyView>
            </div>
        )
    }
}

export default Map;

