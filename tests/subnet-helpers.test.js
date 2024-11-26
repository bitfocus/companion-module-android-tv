const { getBroadcastAddressesFromIP } = require("../subnet-helpers")

const os = {
  networkInterfaces: {
      'eth1': [
        {
          address: '192.168.2.100',
          netmask: '128.0.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/1'
        }
      ],
      'eth2': [
        {
          address: '192.168.2.100',
          netmask: '192.0.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/2'
        }
      ],
      'eth3': [
        {
          address: '192.168.2.100',
          netmask: '224.0.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/3'
        }
      ],
      'eth4': [
        {
          address: '192.168.2.100',
          netmask: '240.0.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/4'
        }
      ],
      'eth5': [
        {
          address: '192.168.2.100',
          netmask: '248.0.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/5'
        }
      ],
      'eth6': [
        {
          address: '192.168.2.100',
          netmask: '252.0.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/6'
        }
      ],
      'eth7': [
        {
          address: '192.168.2.100',
          netmask: '254.0.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/7'
        }
      ],
      'eth8': [
        {
          address: '192.168.2.100',
          netmask: '255.0.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/8'
        }
      ],
      'eth9': [
        {
          address: '192.168.2.100',
          netmask: '255.128.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/9'
        }
      ],
      'eth10': [
        {
          address: '192.168.2.100',
          netmask: '255.192.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/10'
        }
      ],
      'eth11': [
        {
          address: '192.168.2.100',
          netmask: '255.224.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/11'
        }
      ],
      'eth12': [
        {
          address: '192.168.2.100',
          netmask: '255.240.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/12'
        }
      ],
      'eth13': [
        {
          address: '192.168.2.100',
          netmask: '255.248.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/13'
        }
      ],
      'eth14': [
        {
          address: '255.252.0.0',
          netmask: '255.252.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/14'
        }
      ],
      'eth15': [
        {
          address: '192.168.2.100',
          netmask: '255.254.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/15'
        }
      ],
      'eth16': [
        {
          address: '192.168.2.100',
          netmask: '255.255.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/16'
        }
      ],
      'eth17': [
        {
          address: '192.168.2.100',
          netmask: '255.255.128.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/17'
        }
      ],
      'eth18': [
        {
          address: '192.168.2.100',
          netmask: '255.255.192.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/18'
        }
      ],
      'eth19': [
        {
          address: '192.168.2.100',
          netmask: '255.255.224.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/19'
        }
      ],
      'eth20': [
        {
          address: '192.168.2.100',
          netmask: '255.255.240.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/20'
        }
      ],
      'eth21': [
        {
          address: '192.168.2.100',
          netmask: '255.255.248.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/21'
        }
      ],
      'eth22': [
        {
          address: '192.168.2.100',
          netmask: '255.255.252.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/22'
        }
      ],
      'eth23': [
        {
          address: '192.168.2.100',
          netmask: '255.255.254.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/23'
        }
      ],
      'eth24': [
        {
          address: '192.168.2.100',
          netmask: '255.255.255.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/24'
        }
      ],
      'eth25': [
        {
          address: '192.168.2.100',
          netmask: '255.255.255.128',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/25'
        }
      ],
      'eth26': [
        {
          address: '192.168.2.100',
          netmask: '255.255.255.192',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/26'
        }
      ],
      'eth27': [
        {
          address: '192.168.2.100',
          netmask: '255.255.255.224',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/27'
        }
      ],
      'eth28': [
        {
          address: '192.168.2.100',
          netmask: '255.255.255.240',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/28'
        }
      ],
      'eth29': [
        {
          address: '192.168.2.100',
          netmask: '255.255.255.248',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.100/29'
        }
      ],
      'eth30': [
        {
          address: '192.168.2.101',
          netmask: '255.255.255.252',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: false,
          cidr: '192.168.2.101/30'
        }
      ],
      // 'eth31': [
      //   {
      //     address: '192.168.200.3',
      //     netmask: '255.255.255.254',
      //     family: 'IPv4',
      //     mac: '00:00:00:00:00:00',
      //     internal: false,
      //     cidr: '192.168.2.100/31'
      //   }
      // ],
      'lo': [
        {
          address: '127.0.0.1',
          netmask: '255.0.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: true,
          cidr: '127.0.0.0/8'
        }
      ]
    }
}

describe('getBroadcastAddressFromIP', () => {

  test('CIDR 1', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('129.180.120.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
    ]);
    expect(broadcastAddresses.length).toBe(1)
  });

  test('CIDR 2', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('225.180.120.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
    ]);
    expect(broadcastAddresses.length).toBe(1)
  });

  test('CIDR 3', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('220.180.120.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
    ]);
    expect(broadcastAddresses.length).toBe(2)
  });

  test('CIDR 4', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('206.180.120.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
    ]);
    expect(broadcastAddresses.length).toBe(3)
  });

  test('CIDR 5', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('198.180.120.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
    ]);
    expect(broadcastAddresses.length).toBe(4)
  });

  test('CIDR 6', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('194.180.120.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
    ]);
    expect(broadcastAddresses.length).toBe(5)
  });

  test('CIDR 7', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('193.180.120.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
    ]);
    expect(broadcastAddresses.length).toBe(6)
  });

  test('CIDR 8', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.2.120.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
    ]);
    expect(broadcastAddresses.length).toBe(7)
  });

  test('CIDR 9', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.200.120.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
    ]);
    expect(broadcastAddresses.length).toBe(7)
  });

  test('CIDR 10', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.129.120.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
      '192.191.255.255',
    ]);
    expect(broadcastAddresses.length).toBe(8)
  });

  test('CIDR 11', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.180.120.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
      '192.191.255.255',
    ]);
    expect(broadcastAddresses.length).toBe(8)
  });
  test('CIDR 12', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.160.120.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
      '192.191.255.255',
      '192.175.255.255',
    ]);
    expect(broadcastAddresses.length).toBe(9)
  });
  test('CIDR 13', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.175.120.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
      '192.191.255.255',
      '192.175.255.255',
    ]);
    expect(broadcastAddresses.length).toBe(9)
  });
  test('CIDR 14', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.171.120.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
      '192.191.255.255',
      '192.175.255.255',
      '192.171.255.255',
    ]);
    expect(broadcastAddresses.length).toBe(10)
  });
  test('CIDR 15', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.169.120.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
      '192.191.255.255',
      '192.175.255.255',
      '192.171.255.255',
      '192.169.255.255',
    ]);
    expect(broadcastAddresses.length).toBe(11)
  });
  test('CIDR 16', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.168.240.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
      '192.191.255.255',
      '192.175.255.255',
      '192.171.255.255',
      '192.169.255.255',
      '192.168.255.255',
    ]);
    expect(broadcastAddresses.length).toBe(12)
  });

  test('CIDR 17', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.168.120.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
      '192.191.255.255',
      '192.175.255.255',
      '192.171.255.255',
      '192.169.255.255',
      '192.168.255.255',
      '192.168.127.255',
    ]);
    expect(broadcastAddresses.length).toBe(13)
  });

  test('CIDR 18', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.168.60.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
      '192.191.255.255',
      '192.175.255.255',
      '192.171.255.255',
      '192.169.255.255',
      '192.168.255.255',
      '192.168.127.255',
      '192.168.63.255',
    ]);
    expect(broadcastAddresses.length).toBe(14)
  });

  test('CIDR 19', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.168.30.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
      '192.191.255.255',
      '192.175.255.255',
      '192.171.255.255',
      '192.169.255.255',
      '192.168.255.255',
      '192.168.127.255',
      '192.168.63.255',
      '192.168.31.255',
    ]);
    expect(broadcastAddresses.length).toBe(15)
  });

  test('CIDR 20', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.168.14.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
      '192.191.255.255',
      '192.175.255.255',
      '192.171.255.255',
      '192.169.255.255',
      '192.168.255.255',
      '192.168.127.255',
      '192.168.63.255',
      '192.168.31.255',
      '192.168.15.255',
    ]);
    expect(broadcastAddresses.length).toBe(16)
  });

  test('CIDR 21', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.168.7.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
      '192.191.255.255',
      '192.175.255.255',
      '192.171.255.255',
      '192.169.255.255',
      '192.168.255.255',
      '192.168.127.255',
      '192.168.63.255',
      '192.168.31.255',
      '192.168.15.255',
      '192.168.7.255',
    ]);
    expect(broadcastAddresses.length).toBe(17)
  });

  test('CIDR 22', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.168.1.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
      '192.191.255.255',
      '192.175.255.255',
      '192.171.255.255',
      '192.169.255.255',
      '192.168.255.255',
      '192.168.127.255',
      '192.168.63.255',
      '192.168.31.255',
      '192.168.15.255',
      '192.168.7.255',
      '192.168.3.255',
    ]);
    expect(broadcastAddresses.length).toBe(18)
  });

  test('CIDR 23', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.168.3.102',os.networkInterfaces);
    
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
      '192.191.255.255',
      '192.175.255.255',
      '192.171.255.255',
      '192.169.255.255',
      '192.168.255.255',
      '192.168.127.255',
      '192.168.63.255',
      '192.168.31.255',
      '192.168.15.255',
      '192.168.7.255',
      '192.168.3.255',
    ]);
    expect(broadcastAddresses.length).toBe(18)
  });

  test('CIDR 24', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.168.2.129',os.networkInterfaces);
    expect(broadcastAddresses.length).toBe(19)
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
      '192.191.255.255',
      '192.175.255.255',
      '192.171.255.255',
      '192.169.255.255',
      '192.168.255.255',
      '192.168.127.255',
      '192.168.63.255',
      '192.168.31.255',
      '192.168.15.255',
      '192.168.7.255',
      '192.168.3.255',
      '192.168.2.255',
    ]);
  });

  test('CIDR 25', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.168.2.62',os.networkInterfaces);
    expect(broadcastAddresses.length).toBe(20)
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
      '192.191.255.255',
      '192.175.255.255',
      '192.171.255.255',
      '192.169.255.255',
      '192.168.255.255',
      '192.168.127.255',
      '192.168.63.255',
      '192.168.31.255',
      '192.168.15.255',
      '192.168.7.255',
      '192.168.3.255',
      '192.168.2.255',
      '192.168.2.127',
    ]);
  });

  test('CIDR 26', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.168.2.66',os.networkInterfaces);
    expect(broadcastAddresses.length).toBe(20)
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
      '192.191.255.255',
      '192.175.255.255',
      '192.171.255.255',
      '192.169.255.255',
      '192.168.255.255',
      '192.168.127.255',
      '192.168.63.255',
      '192.168.31.255',
      '192.168.15.255',
      '192.168.7.255',
      '192.168.3.255',
      '192.168.2.255',
      '192.168.2.127',
    ]);
  });

  test('CIDR 27', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.168.2.120',os.networkInterfaces);
    expect(broadcastAddresses.length).toBe(20)
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
      '192.191.255.255',
      '192.175.255.255',
      '192.171.255.255',
      '192.169.255.255',
      '192.168.255.255',
      '192.168.127.255',
      '192.168.63.255',
      '192.168.31.255',
      '192.168.15.255',
      '192.168.7.255',
      '192.168.3.255',
      '192.168.2.255',
      '192.168.2.127',
    ]);
  });

  test('CIDR 28', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.168.2.110',os.networkInterfaces);
    expect(broadcastAddresses.length).toBe(21)
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
      '192.191.255.255',
      '192.175.255.255',
      '192.171.255.255',
      '192.169.255.255',
      '192.168.255.255',
      '192.168.127.255',
      '192.168.63.255',
      '192.168.31.255',
      '192.168.15.255',
      '192.168.7.255',
      '192.168.3.255',
      '192.168.2.255',
      '192.168.2.127',
      '192.168.2.111',
    ]);
  });

  test('CIDR 29', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.168.2.98',os.networkInterfaces);
    expect(broadcastAddresses.length).toBe(22)
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
      '192.191.255.255',
      '192.175.255.255',
      '192.171.255.255',
      '192.169.255.255',
      '192.168.255.255',
      '192.168.127.255',
      '192.168.63.255',
      '192.168.31.255',
      '192.168.15.255',
      '192.168.7.255',
      '192.168.3.255',
      '192.168.2.255',
      '192.168.2.127',
      '192.168.2.111',
      '192.168.2.103',
    ]);
  });

  test('CIDR 30', () => {
    const broadcastAddresses = getBroadcastAddressesFromIP('192.168.2.102',os.networkInterfaces);
    expect(broadcastAddresses.length).toBe(22)
    expect(broadcastAddresses).toEqual([
      '255.255.255.255',
      '223.255.255.255',
      '207.255.255.255',
      '199.255.255.255',
      '195.255.255.255',
      '193.255.255.255',
      '192.255.255.255',
      '192.191.255.255',
      '192.175.255.255',
      '192.171.255.255',
      '192.169.255.255',
      '192.168.255.255',
      '192.168.127.255',
      '192.168.63.255',
      '192.168.31.255',
      '192.168.15.255',
      '192.168.7.255',
      '192.168.3.255',
      '192.168.2.255',
      '192.168.2.127',
      '192.168.2.111',
      '192.168.2.103'
    ]);
  });
});