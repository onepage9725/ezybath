const DEFAULT_BILLPLZ_BASE_URL = 'https://www.billplz.com/api/v3';

function trimTrailingSlashes(value) {
  return String(value || '').replace(/\/+$/, '');
}

function getOrigin(req) {
  const forwardedProto = req.headers['x-forwarded-proto'];
  const host = req.headers.host;
  const proto = typeof forwardedProto === 'string' ? forwardedProto.split(',')[0] : 'https';
  if (!host) {
    return null;
  }
  return `${proto}://${host}`;
}

function normalizePhone(value) {
  const raw = String(value || '').trim();
  if (!raw) {
    return '';
  }

  if (raw.startsWith('+')) {
    return raw.replace(/[^+\d]/g, '');
  }

  return raw.replace(/\D/g, '');
}

function toPositiveInteger(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return Math.round(parsed);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      BILLPLZ_COLLECTION_ID,
      BILLPLZ_API_KEY,
      BILLPLZ_SECRET_KEY,
      BILLPLZ_BASE_URL,
      BILLPLZ_CALLBACK_URL,
      BILLPLZ_REDIRECT_URL,
    } = process.env;

    const resolvedApiKey = BILLPLZ_API_KEY || BILLPLZ_SECRET_KEY;

    if (!BILLPLZ_COLLECTION_ID || !resolvedApiKey) {
      return res.status(500).json({ message: 'Billplz env vars are missing.' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const cart = Array.isArray(body.cart) ? body.cart : [];
    const customer = body.customer || {};

    if (cart.length === 0) {
      return res.status(400).json({ message: '购物车不能为空。' });
    }

    const normalizedItems = cart
      .map((item) => {
        const qty = toPositiveInteger(item?.qty);
        const price = Number(item?.price);
        const name = String(item?.name || '').trim();
        if (!qty || !Number.isFinite(price) || price <= 0 || !name) {
          return null;
        }

        return {
          id: String(item.id || '').trim(),
          name,
          qty,
          price,
        };
      })
      .filter(Boolean);

    if (normalizedItems.length === 0) {
      return res.status(400).json({ message: '购物车资料不正确。' });
    }

    const amountCents = Math.round(
      normalizedItems.reduce((sum, item) => sum + item.price * item.qty, 0) * 100,
    );

    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      return res.status(400).json({ message: '金额无效。' });
    }

    const email = String(customer.email || '').trim();
    const mobile = normalizePhone(customer.contactNumber);
    const firstName = String(customer.firstName || '').trim();
    const lastName = String(customer.lastName || '').trim();
    const customerName = `${firstName} ${lastName}`.trim();

    if (!customerName) {
      return res.status(400).json({ message: '请填写姓名。' });
    }

    if (!email && !mobile) {
      return res.status(400).json({ message: '请填写 Email 或手机号码。' });
    }

    const origin = getOrigin(req);
    const callbackUrl = BILLPLZ_CALLBACK_URL || (origin ? `${origin}/api/billplz-webhook` : '');
    const redirectUrl = BILLPLZ_REDIRECT_URL || (origin ? `${origin}/` : '');

    if (!callbackUrl) {
      return res.status(500).json({ message: '缺少 callback_url 配置。' });
    }

    const orderId = `EZY-${Date.now()}`;
    const itemsLabel = normalizedItems.map((item) => `${item.name} x${item.qty}`).join(', ');
    const billingAddress = [
      customer.address,
      customer.apartment,
      customer.postcode,
      customer.city,
      customer.state,
    ]
      .map((value) => String(value || '').trim())
      .filter(Boolean)
      .join(', ');

    const params = new URLSearchParams();
    params.set('collection_id', BILLPLZ_COLLECTION_ID);
    params.set('name', customerName.slice(0, 255));
    params.set('amount', String(amountCents));
    params.set('description', `EzyBath Order ${orderId}`.slice(0, 200));
    params.set('callback_url', callbackUrl);
    if (redirectUrl) {
      params.set('redirect_url', redirectUrl);
    }
    if (email) {
      params.set('email', email);
    }
    if (mobile) {
      params.set('mobile', mobile);
    }

    params.set('reference_1_label', 'Order ID');
    params.set('reference_1', orderId.slice(0, 120));
    params.set('reference_2_label', 'Items');
    params.set('reference_2', itemsLabel.slice(0, 120));

    if (billingAddress) {
      params.set('deliver', 'false');
    }

    const basicAuth = Buffer.from(`${resolvedApiKey}:`).toString('base64');
    const baseUrl = trimTrailingSlashes(BILLPLZ_BASE_URL || DEFAULT_BILLPLZ_BASE_URL);

    const response = await fetch(`${baseUrl}/bills`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        message: 'Billplz bill 创建失败。',
        error: result?.error || result,
      });
    }

    return res.status(200).json({
      id: result.id,
      url: result.url,
      state: result.state,
      paid: result.paid,
    });
  } catch (error) {
    return res.status(500).json({
      message: '服务器错误，无法创建 Billplz bill。',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
