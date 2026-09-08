import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../models/conversation.dart';
import '../../services/conversation_service.dart';
import 'conversation_screen.dart';

class MessagesScreen extends StatefulWidget {
  const MessagesScreen({super.key});

  @override
  State<MessagesScreen> createState() => _MessagesScreenState();
}

class _MessagesScreenState extends State<MessagesScreen> {
  late Future<List<Conversation>> _conversationsFuture;

  @override
  void initState() {
    super.initState();
    _conversationsFuture = ConversationService.getMyConversations();
  }

  Future<void> _refresh() async {
    setState(() {
      _conversationsFuture = ConversationService.getMyConversations();
    });

    await _conversationsFuture;
  }

  Future<void> _openConversation(Conversation conversation) async {
    await Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => ConversationScreen(
          conversation: conversation,
        ),
      ),
    );

    if (!mounted) return;

    setState(() {
      _conversationsFuture = ConversationService.getMyConversations();
    });
  }

  String _participantName(Conversation conversation) {
    for (final participant in conversation.participants) {
      if (participant.user != null) {
        return participant.user!.displayName;
      }
    }

    return 'Conversation';
  }

  String _preview(Conversation conversation) {
    final message = conversation.latestMessage;

    if (message == null || message.content.trim().isEmpty) {
      return 'No messages yet';
    }

    return message.content.trim();
  }

  String _timeLabel(DateTime? dateTime) {
    if (dateTime == null) return '';

    final now = DateTime.now();
    final local = dateTime.toLocal();

    final difference = now.difference(local);

    if (difference.inMinutes < 1) {
      return 'Now';
    }

    if (difference.inHours < 1) {
      return '${difference.inMinutes}m';
    }

    if (difference.inDays < 1) {
      return '${difference.inHours}h';
    }

    if (difference.inDays < 7) {
      return '${difference.inDays}d';
    }

    return '${local.day}/${local.month}/${local.year}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Messages',
          style: TextStyle(
            fontWeight: FontWeight.w800,
          ),
        ),
      ),
      body: FutureBuilder<List<Conversation>>(
        future: _conversationsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }

          if (snapshot.hasError) {
            return _MessagesError(
              message: snapshot.error
                      ?.toString()
                      .replaceFirst('Exception: ', '') ??
                  'Failed to load conversations.',
              onRetry: _refresh,
            );
          }

          final conversations = snapshot.data ?? [];

          if (conversations.isEmpty) {
            return RefreshIndicator(
              onRefresh: _refresh,
              child: ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                children: const [
                  SizedBox(height: 140),
                  Icon(
                    Icons.chat_bubble_outline_rounded,
                    size: 64,
                    color: AppTheme.mutedText,
                  ),
                  SizedBox(height: 20),
                  Center(
                    child: Text(
                      'No conversations yet',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                  SizedBox(height: 8),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 40),
                    child: Text(
                      'When you contact a seller or someone contacts you, your conversations will appear here.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: AppTheme.mutedText,
                        height: 1.5,
                      ),
                    ),
                  ),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: _refresh,
            child: ListView.separated(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemCount: conversations.length,
              separatorBuilder: (_, _) => const Divider(
                height: 1,
                indent: 84,
              ),
              itemBuilder: (context, index) {
                final conversation = conversations[index];
                final listingTitle =
                    conversation.listing?.title ?? 'Listing';

                return ListTile(
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 8,
                  ),
                  leading: CircleAvatar(
                    radius: 26,
                    backgroundColor:
                        AppTheme.primaryRed.withValues(alpha: 0.1),
                    backgroundImage:
                        conversation.participants.isNotEmpty &&
                                conversation
                                        .participants
                                        .first
                                        .user
                                        ?.profileImage !=
                                    null
                            ? NetworkImage(
                                conversation
                                    .participants
                                    .first
                                    .user!
                                    .profileImage!,
                              )
                            : null,
                    child: conversation.participants.isEmpty ||
                            conversation
                                    .participants
                                    .first
                                    .user
                                    ?.profileImage ==
                                null
                        ? const Icon(
                            Icons.person_outline_rounded,
                            color: AppTheme.primaryRed,
                          )
                        : null,
                  ),
                  title: Row(
                    children: [
                      Expanded(
                        child: Text(
                          _participantName(conversation),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontWeight: FontWeight.w800,
                            fontSize: 16,
                          ),
                        ),
                      ),
                      if (conversation.latestMessage != null)
                        Text(
                          _timeLabel(
                            conversation.latestMessage!.createdAt,
                          ),
                          style: const TextStyle(
                            color: AppTheme.mutedText,
                            fontSize: 12,
                          ),
                        ),
                    ],
                  ),
                  subtitle: Padding(
                    padding: const EdgeInsets.only(top: 5),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          listingTitle,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.primaryRed,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          _preview(conversation),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: AppTheme.mutedText,
                          ),
                        ),
                      ],
                    ),
                  ),
                  trailing: const Icon(
                    Icons.chevron_right_rounded,
                    color: AppTheme.mutedText,
                  ),
                  onTap: () => _openConversation(conversation),
                );
              },
            ),
          );
        },
      ),
    );
  }
}

class _MessagesError extends StatelessWidget {
  const _MessagesError({
    required this.message,
    required this.onRetry,
  });

  final String message;
  final Future<void> Function() onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.chat_bubble_outline_rounded,
              size: 52,
              color: AppTheme.mutedText,
            ),
            const SizedBox(height: 16),
            const Text(
              'Could not load messages',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: AppTheme.mutedText,
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: onRetry,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primaryRed,
                foregroundColor: Colors.white,
              ),
              child: const Text('Try Again'),
            ),
          ],
        ),
      ),
    );
  }
}
