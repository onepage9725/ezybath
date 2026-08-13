const crypto = require('node:crypto');

function flattenParams(input, prefix = '') {
  const entries = [];

  if (Array.isArray(input)) {
    for (const value of input) {
      entries.push(...flattenParams(value, prefix));
    }
    return entries;
  }

  if (input && typeof input === 'object') {
    for (const [key, value] of Object.entries(input)) {
      const nextPrefix = `${prefix}${key}`;
      entries.push(...flattenParams(value, nextPrefix));
    }
    return entries;
  }

  const normalizedValue = input == null ? '' : String(input);
  entries.push([prefix, normalizedValue]);
  return entries;
}

function buildSignatureSource(payload) {
  const flat = flattenParams(payload)
    .filter(([key]) => key && key.toLowerCase() !== 'x_signature')
    .map(([key, value]) => `${key}${value}`)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  return flat.join('|');
}

function parseBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  if (typeof req.body === 'string') {
    return Object.fromEntries(new URLSearchParams(req.body));
  }

  return {};
}

function safeEqualHex(a, b) {
  if (!a || !b) {
    return false;
  }

  const left = Buffer.from(String(a), 'utf8');
  const right = Buffer.from(String(b), 'utf8');

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const xSignatureKey = process.env.BILLPLZ_X_SIGNATURE;
  if (!xSignatureKey) {
    return res.status(500).json({ message: 'Missing BILLPLZ_X_SIGNATURE.' });
  }

  try {
    const payload = parseBody(req);
    const providedSignature = String(payload.x_signature || '').trim();

    if (!providedSignature) {
      return res.status(400).json({ message: 'Missing x_signature.' });
    }

    const source = buildSignatureSource(payload);
    const computedSignature = crypto
      .createHmac('sha256', xSignatureKey)
      .update(source)
      .digest('hex');

    if (!safeEqualHex(computedSignature, providedSignature)) {
      return res.status(400).json({ message: 'Invalid x_signature.' });
    }

    const paymentStatus = {
      billId: payload.id || null,
      collectionId: payload.collection_id || null,
      paid: String(payload.paid || '') === 'true',
      state: payload.state || null,
      paidAmount: payload.paid_amount || null,
      paidAt: payload.paid_at || null,
      transactionId: payload.transaction_id || null,
      transactionStatus: payload.transaction_status || null,
      reference1: payload.reference_1 || null,
    };

    console.log('Billplz webhook verified:', paymentStatus);

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({
      message: 'Webhook processing failed.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
