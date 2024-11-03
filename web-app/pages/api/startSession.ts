import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { connectToDB } from '@/utils/mongodb';  // Using the path alias for src/utils/mongodb
import { Db } from 'mongodb';

interface Conversation {
   sessionId: string;
   userId: string | null;
   date: string;
   steps: { messageId: number; from: string; content: string; timestamp: string }[];
   finalOffer: number | null;
   shippingLabel: string | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === "POST") {
      const db: Db = await connectToDB();
      const sessionId = uuidv4();

      const newSession: Conversation = {
         sessionId,
         userId: req.body.userId || null,
         date: new Date().toISOString(),
         steps: [],
         finalOffer: null,
         shippingLabel: null,
      };

      await db.collection<Conversation>("conversations").insertOne(newSession);
      res.status(200).json({ sessionId });
   } else {
      res.status(405).json({ message: "Method Not Allowed" });
   }
}
