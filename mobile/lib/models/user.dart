class User {
  const User({
    required this.id,
    this.firstName,
    this.lastName,
    this.username,
    this.email,
    this.phone,
    this.profileImage,
    this.role,
  });

  final String id;
  final String? firstName;
  final String? lastName;
  final String? username;
  final String? email;
  final String? phone;
  final String? profileImage;
  final String? role;

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id']?.toString() ?? '',
      firstName: json['firstName']?.toString(),
      lastName: json['lastName']?.toString(),
      username: json['username']?.toString(),
      email: json['email']?.toString(),
      phone: json['phone']?.toString(),
      profileImage: json['profileImage']?.toString(),
      role: json['role']?.toString(),
    );
  }

  String get displayName {
    final parts = [firstName, lastName]
        .where((value) => value != null && value.trim().isNotEmpty)
        .map((value) => value!.trim())
        .toList();

    if (parts.isNotEmpty) {
      return parts.join(' ');
    }

    if (username != null && username!.trim().isNotEmpty) {
      return username!.trim();
    }

    if (email != null && email!.trim().isNotEmpty) {
      return email!.trim();
    }

    return 'FaultMart User';
  }

  String get initials {
    final name = displayName.trim();

    if (name.isEmpty) {
      return 'F';
    }

    final parts = name.split(RegExp(r'\s+'));

    if (parts.length == 1) {
      return parts.first[0].toUpperCase();
    }

    return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
  }
}
