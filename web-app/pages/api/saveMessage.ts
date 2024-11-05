import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDB } from '@/utils/mongodb';
import { Db } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === "POST") {
      const { sessionId, from, content } = req.body;

      if (!sessionId || !from || !content) {
         return res.status(400).json({ message: "Missing required fields" });
      }

      const db: Db = await connectToDB();
      const timestamp = new Date().toISOString();

      try {
         await db.collection("conversations").updateOne(
            { sessionId },
            {
               $push: {
                  steps: { messageId: Date.now(), from, content, timestamp },
               },
            }
         );
         res.status(200).json({ message: "Message saved" });
      } catch (error) {
         console.error("Error saving message:", error);
         res.status(500).json({ message: "Failed to save message", error });
      }
   } else {
      res.status(405).json({ message: "Method Not Allowed" });
   }
}
