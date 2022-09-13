// converted from https://blog.ip2location.com/knowledge-base/how-to-convert-ip-address-range-into-cidr/

/**
 * 
 * @param {string} start 
 * @param {string} end 
 */
function rangeToCidr(start, end) {
    let startLong = ip2long(start);
    let endLong = ip2long(end);

    const res = [];
    while(endLong >= startLong) {
        let maxSize = 32;
        while(maxSize > 0) {
            const mask = iMask(maxSize - 1);
            const maskBase = startLong & mask;

            if(maskBase != startLong) 
                break;
            
            maxSize--;
        }
        const x = Math.log(endLong - startLong + 1) / Math.log(2);
        const maxDiff = 32 - Math.floor(x);
        if (maxSize < maxDiff)
            maxSize = maxDiff;
        
        const ip = long2ip(startLong);
        res.push(ip + "/" + maxSize);
        startLong += Math.pow(2, (32 - maxSize));
    }
    return res;
}

/**
 * 
 * @param {number} s 
 */
function iMask(s) {
    return Math.round(Math.pow(2, 32) - Math.pow(2, (32 - s)));
}

/**
 * 
 * @param {string} ip 
 */
function ip2long(ip) {
    const ipSplit = ip.split(".");
    let num = 0;
    for(let i = 3; i >= 0; i--) {
        let ip = ipSplit[3 - i];
        num |= ip << (i << 3); 
    }
    return num;
}

/**
 * 
 * @param {number} longIp 
 * @returns 
 */
function long2ip(longIp) {
    let ret = "";
    ret += longIp >>> 24;
    ret += "."
    ret += (longIp & 0x00FFFFFF) >>> 16
    ret += "."
    ret += (longIp & 0x0000FFFF) >>> 8
    ret += "."
    ret += longIp & 0x000000FF
    return ret
}