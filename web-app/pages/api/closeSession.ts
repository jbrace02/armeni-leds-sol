import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDB } from '@/utils/mongodb';
import { Db } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === "POST") {
      const { sessionId, finalOffer, shippingLabel } = req.body;

      if (!sessionId || finalOffer === undefined || !shippingLabel) {
         return res.status(400).json({ message: "Missing required fields" });
      }

      const db: Db = await connectToDB();

      try {
         await db.collection("conversations").updateOne(
            { sessionId },
            {
               $set: { finalOffer, shippingLabel },
            }
         );
         res.status(200).json({ message: "Session closed" });
      } catch (error) {
         console.error("Error closing session:", error);
         res.status(500).json({ message: "Failed to close session", error });
      }
   } else {
      res.status(405).json({ message: "Method Not Allowed" });
   }
}

