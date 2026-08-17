"use client";

import { useParams } from "next/navigation";
import ChatWindow from "@/components/messages/ChatWindow";

export default function ConversationPage() {
  const params = useParams();

  const conversationId = String(
    params.conversationId
  );

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <ChatWindow
          conversationId={conversationId}
        />
      </div>
    </main>
  );
}
