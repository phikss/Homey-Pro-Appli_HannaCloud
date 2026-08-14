'use strict';

const Homey = require('homey');

class PoolControllerDriver extends Homey.Driver {

  async onInit() {
    this.log('Driver Pool Controller prêt.');
  }

  async onPair(session) {
    // Les identifiants sont configurés au niveau app (réglages de l'application).
    // Le pairing utilise un client authentifié fourni par l'app.
    session.setHandler('list_devices', async () => {
      let client;
      try {
        client = await this.homey.app.createAuthenticatedClient();
      } catch (err) {
        // Identifiants absents ou invalides → message clair pour l'utilisateur
        throw new Error(err.message);
      }

      const devices = await client.getDevices();
      if (devices.length === 0) {
        throw new Error('Aucun contrôleur trouvé sur ce compte HannaCloud.');
      }

      return devices.map(d => ({
        name: d.name,
        data: { id: d.id },
        store: { model: d.model, serial: d.serial },
      }));
    });
  }

}

module.exports = PoolControllerDriver;
