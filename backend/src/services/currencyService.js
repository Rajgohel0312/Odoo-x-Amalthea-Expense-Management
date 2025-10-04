const axios = require('axios');

const BASE = process.env.EXCHANGE_API_BASE || 'https://api.exchangerate-api.com/v4/latest';
const cache = { rates: {}, ts: {} };
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes

async function getRates(base) {
  const now = Date.now();
  if (cache.rates[base] && (now - cache.ts[base]) < CACHE_TTL_MS) {
    return cache.rates[base];
  }
  const url = `${BASE}/${base}`;
  const res = await axios.get(url);
  cache.rates[base] = res.data;
  cache.ts[base] = now;
  return res.data;
}

async function convert(amount, from, to) {
  if (!amount) return 0;
  if (!from || !to) throw new Error('Currencies required');
  if (from === to) return amount;
  const data = await getRates(from);
  const rate = data.rates[to];
  if (!rate) throw new Error(`No rate for ${to}`);
  return parseFloat((amount * rate).toFixed(2));
}

module.exports = { convert, getRates };
