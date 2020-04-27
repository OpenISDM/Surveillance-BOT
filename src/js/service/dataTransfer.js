/** Retrieve the object's offset from object's mac_address.
 * @param   mac_address The mac_address of the object retrieved from DB. 
 * @param   lbeacon_coordinate The lbeacon's coordinate processed by createLbeaconCoordinate().*/
export const macAddressToCoordinate = (mac_address, lbeacon_coordinate, dispersity) => {
    const xx = mac_address.slice(15,16);
    const yy = mac_address.slice(16,17);
    const origin_x = lbeacon_coordinate[1] 
    const origin_y = lbeacon_coordinate[0]
    const xxx = origin_x + parseInt(xx, 16) * dispersity;
    const yyy = origin_y + parseInt(yy, 16) * dispersity;
    return [yyy, xxx];
}