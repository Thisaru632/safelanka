import dns from 'node:dns';
// Optional fallback for networks whose default DNS cannot resolve Atlas hosts.
const resolver = new dns.Resolver();
resolver.setServers(['1.1.1.1', '8.8.8.8']);
dns.setServers(['1.1.1.1', '8.8.8.8']);
export function atlasLookup(hostname, options, callback) {
  dns.lookup(hostname, options, (error, address, family) => {
    if (!error) return callback(null, address, family);
    if (error.code !== 'ENOTFOUND' && error.code !== 'EAI_AGAIN') return callback(error);
    resolver.resolve4(hostname, (fallbackError, addresses) => {
      if (fallbackError) return callback(fallbackError);
      if (options?.all) return callback(null, addresses.map(address => ({ address, family: 4 })));
      callback(null, addresses[0], 4);
    });
  });
}

