'use strict';

const Homey = require('homey');
const HannaCloudClient = require('./lib/HannaCloudClient');

class HannaCloudApp extends Homey.App {

  async onInit() {
    this.log('Hanna Cloud Pool — démarrage.');
    this._registerFlowConditions();
  }

  /**
   * Retourne les identifiants HannaCloud configurés au niveau app.
   */
  getCredentials() {
    return {
      email: this.homey.settings.get('hanna_email'),
      password: this.homey.settings.get('hanna_password'),
    };
  }

  /**
   * Crée un client authentifié à partir des identifiants centralisés.
   * Lève une erreur lisible si les identifiants sont absents ou invalides.
   */
  async createAuthenticatedClient() {
    const { email, password } = this.getCredentials();
    if (!email || !password) {
      throw new Error('Identifiants HannaCloud non configurés. Ouvrez les réglages de l\'application.');
    }
    const client = new HannaCloudClient();
    await client.authenticate(email, password);
    return client;
  }

  /**
   * Endpoint appelé par la page de réglages pour tester la connexion.
   */
  async testLogin() {
    const client = await this.createAuthenticatedClient();
    const devices = await client.getDevices();
    return { success: true, deviceCount: devices.length };
  }

  _registerFlowConditions() {
    this.homey.flow.getConditionCard('ph_in_range')
      .registerRunListener(({ device, min_ph, max_ph }) => {
        const ph = device.getCapabilityValue('measure_ph');
        return ph !== null && ph >= min_ph && ph <= max_ph;
      });

    this.homey.flow.getConditionCard('orp_in_range')
      .registerRunListener(({ device, min_orp, max_orp }) => {
        const orp = device.getCapabilityValue('measure_chlorine_orp');
        return orp !== null && orp >= min_orp && orp <= max_orp;
      });
  }

}

module.exports = HannaCloudApp;
