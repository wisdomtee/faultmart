"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  MessageCircle,
  Send,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  getConversation,
  getMessages,
  sendMessage,
  deleteMessage,
  markMessageAsRead,
} from "@/lib/api";

import { useAuthStore } from "@/store/auth-store";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  type: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string | null;
  };
}

interface Conversation {
  id: string;
  listing?: {
    id: string;
    title: string;
    slug: string;
    price: string | number;
    currency: string;
  } | null;
  participants: Array<{
    id: string;
    userId: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      profileImage?: string | null;
    };
  }>;
}

interface Props {
  conversationId: string;
}

export default function ChatWindow({
  conversationId,
}: Props) {
  const router = useRouter();

  const currentUser = useAuthStore(
    (state) => state.user
  );

  const [conversation, setConversation] =
    useState<Conversation | null>(null);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [content, setContent] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadConversation() {
      try {
        setLoading(true);

        const [
          conversationData,
          messagesData,
        ] = await Promise.all([
          getConversation(conversationId),
          getMessages(conversationId),
        ]);

        setConversation(conversationData);
        setMessages(messagesData);

        for (const message of messagesData) {
          if (
            message.senderId !== currentUser?.id &&
            !message.isRead
          ) {
            try {
              await markMessageAsRead(
                message.id
              );
            } catch {
              // Ignore individual read failures.
            }
          }
        }
      } catch (error) {
        console.error(
          "Failed to load conversation:",
          error
        );

        toast.error(
          "Unable to load this conversation."
        );
      } finally {
        setLoading(false);
      }
    }

    if (conversationId) {
      loadConversation();
    }
  }, [conversationId, currentUser?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSendMessage(
    event: FormEvent
  ) {
    event.preventDefault();

    const trimmedContent =
      content.trim();

    if (!trimmedContent || sending) {
      return;
    }

    try {
      setSending(true);

      const message =
        await sendMessage(
          conversationId,
          trimmedContent
        );

      setMessages((previous) => [
        ...previous,
        message,
      ]);

      setContent("");
    } catch (error) {
      console.error(
        "Failed to send message:",
        error
      );

      toast.error(
        "Unable to send message."
      );
    } finally {
      setSending(false);
    }
  }

  async function handleDeleteMessage(
    messageId: string
  ) {
    try {
      await deleteMessage(messageId);

      setMessages((previous) =>
        previous.filter(
          (message) =>
            message.id !== messageId
        )
      );

      toast.success("Message deleted.");
    } catch (error) {
      console.error(
        "Failed to delete message:",
        error
      );

      toast.error(
        "Unable to delete message."
      );
    }
  }

  const otherParticipant =
    conversation?.participants.find(
      (participant) =>
        participant.userId !== currentUser?.id
    );

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center rounded-3xl border bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="rounded-3xl border bg-white p-10 text-center">
        <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />

        <h1 className="mt-4 text-xl font-bold">
          Conversation not found
        </h1>

        <button
          onClick={() => router.back()}
          className="mt-6 rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[600px] flex-col overflow-hidden rounded-3xl border bg-white shadow-sm">
      {/* HEADER */}
      <header className="flex items-center gap-4 border-b px-5 py-4">
        <button
          onClick={() => router.back()}
          className="rounded-full p-2 transition hover:bg-gray-100"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-orange-100 font-bold text-orange-700">
          {otherParticipant?.user.profileImage ? (
            <img
              src={
                otherParticipant.user
                  .profileImage
              }
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            otherParticipant?.user.firstName?.[0]
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="truncate font-bold">
            {otherParticipant
              ? `${otherParticipant.user.firstName} ${otherParticipant.user.lastName}`
              : "Conversation"}
          </h1>

          {conversation.listing && (
            <p className="truncate text-sm text-gray-500">
              {conversation.listing.title}
            </p>
          )}
        </div>
      </header>

      {/* MESSAGES */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-5">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <MessageCircle className="mx-auto h-12 w-12 text-gray-300" />

              <p className="mt-3 font-semibold text-gray-500">
                No messages yet
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Start the conversation.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isMine =
              message.senderId ===
              currentUser?.id;

            return (
              <div
                key={message.id}
                className={`flex ${
                  isMine
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`group relative max-w-[80%] rounded-2xl px-4 py-3 ${
                    isMine
                      ? "rounded-br-md bg-orange-600 text-white"
                      : "rounded-bl-md border bg-white text-gray-900"
                  }`}
                >
                  {message.content && (
                    <p className="whitespace-pre-wrap break-words text-sm leading-6">
                      {message.content}
                    </p>
                  )}

                  <div
                    className={`mt-1 flex items-center gap-2 text-[11px] ${
                      isMine
                        ? "text-orange-100"
                        : "text-gray-400"
                    }`}
                  >
                    <span>
                      {new Date(
                        message.createdAt
                      ).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>

                    {isMine && (
                      <button
                        onClick={() =>
                          handleDeleteMessage(
                            message.id
                          )
                        }
                        className="opacity-0 transition group-hover:opacity-100"
                        title="Delete message"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* COMPOSER */}
      <form
        onSubmit={handleSendMessage}
        className="border-t bg-white p-4"
      >
        <div className="flex items-end gap-3">
          <textarea
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey
              ) {
                event.preventDefault();

                if (!sending) {
                  handleSendMessage(
                    event
                  );
                }
              }
            }}
            placeholder="Write a message..."
            rows={1}
            maxLength={5000}
            className="min-h-[48px] flex-1 resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />

          <button
            type="submit"
            disabled={
              sending ||
              !content.trim()
            }
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send message"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
