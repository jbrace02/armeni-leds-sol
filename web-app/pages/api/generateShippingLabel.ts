import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface ShippoAddress {
  name: string;
  street1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email: string;
  phone: string;  // Added phone field
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const shippoApiKey = process.env.SHIPPO_API_KEY || '';

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { addressInfo, deviceInfo } = req.body;

    if (!addressInfo) {
      res.status(400).json({ error: 'Address information is missing' });
      return;
    }

    const fromAddress: ShippoAddress = {
      name: addressInfo.name,
      street1: addressInfo.street1,
      city: addressInfo.city,
      state: addressInfo.state,
      zip: addressInfo.zip,
      country: 'US',
      email: addressInfo.email,
      phone: '404-000-0000'  // We should collect this from the user
    };

    const toAddress: ShippoAddress = {
      name: 'ShopRefit, LLC',
      street1: '10945 STATE BRIDGE RD STE 401',
      city: 'ALPHARETTA',
      state: 'GA',
      zip: '30022',
      country: 'US',
      email: 'jeremy@shoprefit.com',
      phone: '404-000-0000'  // Replace with your actual business phone
    };

    const parcel = {
      length: '8.7',
      width: '5.4',
      height: '1.7',
      distance_unit: 'in',
      weight: '1',
      mass_unit: 'lb',
    };

    console.log('Sending request to Shippo:', {
      address_from: fromAddress,
      address_to: toAddress,
      parcels: [parcel],
    });

    const shipmentResponse = await axios.post(
      'https://api.goshippo.com/shipments/',
      {
        address_from: fromAddress,
        address_to: toAddress,
        parcels: [parcel],
        async: false,
        extra: {
          reference_1: deviceInfo?.model || '',
          reference_2: `${deviceInfo?.storage || ''} ${deviceInfo?.carrier || ''}`,
          reference_3: `Condition: ${deviceInfo?.condition || ''} Price: $${deviceInfo?.price || '0'}`
        }
      },
      {
        headers: {
          Authorization: `ShippoToken ${shippoApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const shipment = shipmentResponse.data;
    const rates = shipment.rates;

    console.log('Available rates:', rates.map((rate: any) => ({
      provider: rate.provider,
      service: rate.servicelevel.name,
      attributes: rate.attributes,
      amount: rate.amount,
      currency: rate.currency
    })));

    if (!rates?.length) {
      console.error('No shipping rates available.');
      res.status(500).json({ error: 'No shipping rates available' });
      return;
    }

    // Find USPS Priority Mail rate
    const selectedRate = rates.find(
      (rate: any) =>
        rate.provider === 'USPS' &&
        rate.servicelevel.name === 'Priority Mail'
    );

    if (!selectedRate) {
      console.error('Available rates:', rates);
      res.status(500).json({ 
        error: 'No USPS Priority Mail rate available',
        availableRates: rates.map((r: any) => ({
          provider: r.provider,
          service: r.servicelevel.name,
          attributes: r.attributes,
          amount: r.amount
        }))
      });
      return;
    }

    console.log('Selected rate:', {
      provider: selectedRate.provider,
      service: selectedRate.servicelevel.name,
      amount: selectedRate.amount,
      currency: selectedRate.currency
    });

    const transactionResponse = await axios.post(
      'https://api.goshippo.com/transactions/',
      {
        rate: selectedRate.object_id,
        label_file_type: 'PDF',
        async: false,
      },
      {
        headers: {
          Authorization: `ShippoToken ${shippoApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const transaction = transactionResponse.data;

    if (transaction.status === 'SUCCESS') {
      res.status(200).json({
        labelUrl: transaction.label_url,
        trackingNumber: transaction.tracking_number
      });
    } else {
      console.error('Error purchasing label:', transaction.messages);
      res.status(500).json({
        error: 'Error purchasing label',
        details: transaction.messages
      });
    }

  } catch (error: any) {
    console.error('Full error:', error.response?.data || error);
    res.status(500).json({
      error: 'Error generating shipping label',
      detail: error.response?.data?.detail || error.message,
      fullError: error.response?.data || error.message
    });
  }
}

