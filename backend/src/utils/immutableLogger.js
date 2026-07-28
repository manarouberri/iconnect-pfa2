const crypto = require('crypto');

/**
 * Logger à chaînage de hash (inspiré du principe blockchain simplifié).
 * Chaque entrée contient le hash de l'entrée précédente : toute modification
 * a posteriori d'une entrée casse la chaîne et devient détectable.
 *
 * ⚠️ Démonstrateur pédagogique : en production, stocker ces entrées dans une
 * base append-only (ex: table SQL en INSERT-only + trigger interdisant UPDATE/DELETE,
 * ou un vrai système de logging externe comme AWS CloudTrail / ELK avec WORM storage).
 */
class ImmutableLogger {
  constructor() {
    this.chain = [];
    this.genesisHash = '0'.repeat(64);
  }

  _hashEntry(entry, previousHash) {
    const data = JSON.stringify({ ...entry, previousHash });
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  log({ user, ip, module, action, oldValue, newValue }) {
    const previousHash = this.chain.length > 0
      ? this.chain[this.chain.length - 1].hash
      : this.genesisHash;

    const entry = {
      date: new Date().toISOString(),
      user: user || 'anonymous',
      ip: ip || 'unknown',
      module,
      action,
      oldValue: oldValue ?? null,
      newValue: newValue ?? null,
      previousHash,
    };

    entry.hash = this._hashEntry(entry, previousHash);
    this.chain.push(entry);
    return entry;
  }

  /**
   * Vérifie l'intégrité de toute la chaîne de logs.
   * Retourne { valid: boolean, brokenAtIndex: number|null }
   */
  verifyIntegrity() {
    let expectedPrevious = this.genesisHash;

    for (let i = 0; i < this.chain.length; i++) {
      const entry = this.chain[i];
      if (entry.previousHash !== expectedPrevious) {
        return { valid: false, brokenAtIndex: i };
      }
      const { hash, ...entryWithoutHash } = entry;
      const recomputed = this._hashEntry(entryWithoutHash, entry.previousHash);
      if (recomputed !== hash) {
        return { valid: false, brokenAtIndex: i };
      }
      expectedPrevious = entry.hash;
    }
    return { valid: true, brokenAtIndex: null };
  }

  getAll() {
    return this.chain;
  }
}

module.exports = new ImmutableLogger();
