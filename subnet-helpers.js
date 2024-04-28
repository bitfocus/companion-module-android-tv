const os = require('os')

function getBroadcastAddressesFromIP(ipAddress, networkInterfaces) {
    return Object.entries(networkInterfaces).map(interfaceName => {
      const [ ,networkInterface] = interfaceName
      const interfaceInfo = networkInterface.find((info) => {
        // Check if the provided IP address is within the subnet of this network interface
        const [subnet, prefix] = info.cidr.split('/');
        
        const prefixLength = parseInt(prefix, 10);
        const networkAddress = subnet.split('.').map((octet) => parseInt(octet, 10));

        const mask = (0xFFFFFFFF << (32 - prefixLength)) >>> 0;
        
        // Calculate the network address integer
        const networkAddressInt = networkAddress.reduce((acc, part, index) => {
          return acc | (part << (24 - 8 * index));
        }, 0) & mask;
        
        const ipAddressInt = ipAddress.split('.').reduce((acc, octet, index) => acc | (parseInt(octet, 10) << (24 - index * 8)), 0);
        
        return (ipAddressInt & mask) === networkAddressInt;
      });

      if (interfaceInfo) {
        return getBroadcastAddress(interfaceInfo)
      }
    })
    .filter(each => each !== undefined)
    .filter((each, index, array) => array.indexOf(each) === index)
}

function invertIPAddress(ipAddress) {
	// Split the IP address into octets
	const octets = ipAddress.split('.').map(Number);
  
	// Perform binary inversion on each octet
	const invertedOctets = octets.map(octet => 0xFF ^ octet);
  
	return invertedOctets;
  }

  function getBroadcastAddress(networkInterface) {
    const { cidr, netmask } = networkInterface
    const [subnet, ] = cidr.split('/');
    const subnetParts = subnet.split('.').map(octet => parseInt(octet, 10));
  
    const invertedNetmask = invertIPAddress(netmask)
    
    const broadcastAddress = invertedNetmask.map( (each, index) => {
      return each | subnetParts[index]
    })
    return broadcastAddress.join('.')
  }  

  function getNetworkInterfacesIPv4() {
    const networkInterfaces = os.networkInterfaces()
    const interfaceList = {}
    for (const nInterface in networkInterfaces) {
      const list = networkInterfaces[nInterface].filter(each => each.family === 'IPv4' && !each.internal)
      if (list.length !== 0) {
        const ip = list.filter(each => each.family === 'IPv4')
        interfaceList[nInterface] = ip
      }
    }
    return interfaceList
  }

  module.exports = { getBroadcastAddressesFromIP, getNetworkInterfacesIPv4 };