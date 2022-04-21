import fs from 'fs';
import toml from '@iarna/toml';
import { HardhatPluginError } from 'hardhat/plugins';

import { formatBytes32String } from "@ethersproject/strings";

export default function loadFoundry(filepath: string) {
  if (!fs.existsSync(filepath)) {
    throw new HardhatPluginError(
      'foundry',
      `Foundry configuration  '${filepath}' not found.`
    );
  }

  const def = toml.parse(fs.readFileSync(filepath).toString('utf8'));

  if (!def.name || typeof def.name !== 'string') {
    throw new Error('Invalid "name" property on foundry.toml');
  }

  try {
    formatBytes32String(def.name);
  } catch (err) {
    let msg = 'Invalid "name" property on foundry.toml. ';
    if (err instanceof Error) msg += err.message;
    throw new Error(msg);
  }

  if (!def.version || typeof def.version !== 'string') {
    throw new Error('Invalid "version" property on foundry.toml');
  }

  try {
    formatBytes32String(def.version);
  } catch (err) {
    let msg = 'Invalid "version" property on foundry.toml. ';
    if (err instanceof Error) msg += err.message;
    throw new Error(msg);
  }

  return def as any;
}