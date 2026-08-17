"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Loader2 } from "lucide-react";

import { getMyConversations } from "@/lib/api";

interface Conversation {
  id: string;
  listing?: {
    id: string;
    title: string;
    slug: string;
    price: string | number;
    images?: {
      url: string;
    }[];
  } | null;
  participants: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      profileImage?: string | null;
    };
  }[];
  messages?: {
    id: string;
    content: string | null;
    createdAt: string;
    senderId: string;
  }[];
  updatedAt: string;
}

export default function MessagesPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadConversations() {
      try {
        setLoading(true);

        const data =
          await getMyConversations();

        setConversations(data);
      } catch (err) {
        console.error(
          "Failed to load conversations:",
          err
        );

        setError(
          "Unable to load your conversations."
        );
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Messages
        </h1>

        <p className="mt-2 text-gray-500">
          Chat with buyers and sellers on FaultMart.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin" />

          <span className="ml-3 text-gray-500">
            Loading conversations...
          </span>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-20 text-center">
            <MessageCircle className="mb-4 h-12 w-12 text-gray-400" />

            <h2 className="text-xl font-semibold">
              No conversations yet
            </h2>

            <p className="mt-2 text-gray-500">
              When you contact a seller or receive
              a message, your conversations will
              appear here.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        conversations.length > 0 && (
          <div className="overflow-hidden rounded-xl border bg-white">
            {conversations.map(
              (conversation) => {
                const lastMessage =
                  conversation.messages?.[0];

                return (
                  <Link
                    key={conversation.id}
                    href={`/messages/${conversation.id}`}
                    className="block border-b p-5 transition hover:bg-gray-50 last:border-b-0"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="truncate font-semibold">
                          {conversation.listing
                            ?.title ||
                            "Conversation"}
                        </h2>

                        <p className="mt-1 truncate text-sm text-gray-500">
                          {lastMessage?.content ||
                            "No messages yet"}
                        </p>
                      </div>

                      <span className="shrink-0 text-xs text-gray-400">
                        {new Date(
                          conversation.updatedAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        )}
    </main>
  );
}