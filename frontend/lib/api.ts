import api from "./axios";
import { useAuthStore } from "@/store/auth-store";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001";

/**
 * =========================================================
 * HOMEPAGE
 * =========================================================
 */

/**
 * Get homepage data
 */
export async function getHomeData() {
  const res = await fetch(`${API_URL}/api/home`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();

    console.log("HOME API ERROR:", errorText);

    throw new Error(`Homepage API failed: ${res.status}`);
  }

  const data = await res.json();

  return data.data;
}

/**
 * =========================================================
 * PUBLIC LISTINGS
 * =========================================================
 */

/**
 * Get listing by slug
 */
export async function getListingBySlug(slug: string) {
  const res = await fetch(
    `${API_URL}/api/listings/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Listing fetch failed: ${res.status}`);
  }

  const data = await res.json();

  return data.data;
}

/**
 * Get listing by ID
 */
export async function getListingById(id: string) {
  const res = await fetch(
    `${API_URL}/api/listings/id/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Listing fetch failed: ${res.status}`);
  }

  const data = await res.json();

  return data.data;
}

export interface GetListingsParams {
  search?: string;
  categoryId?: string;
  state?: string;
  city?: string;
  condition?: string;
  faultSeverity?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

/**
 * Get listings
 */
export async function getListings(
  params: GetListingsParams = {}
) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();

  const res = await fetch(
    `${API_URL}/api/listings${
      queryString ? `?${queryString}` : ""
    }`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(
      `Listings fetch failed: ${res.status}`
    );
  }

  const data = await res.json();

  return data.data;
}

/**
 * =========================================================
 * SELLER LISTINGS
 * =========================================================
 */

/**
 * Get current seller's listings
 *
 * Protected route:
 * GET /api/listings/me
 */
export async function getMyListings() {
  const { data } = await api.get("/api/listings/me");

  return data.data;
}

/**
 * =========================================================
 * AI LISTING ASSISTANT
 * =========================================================
 */

export interface ListingAssistantPayload {
  title?: string;
  description?: string;
  category?: string;
  condition?: string;
  faultSeverity?: string;
  faultDescription?: string;
}

export interface ListingAssistantResult {
  suggestedTitle: string;
  improvedDescription: string;
  suggestedFaultSeverity:
    | "MINOR"
    | "MODERATE"
    | "MAJOR"
    | "CRITICAL"
    | null;
  suggestions: string[];
}

/**
 * Generate AI assistance for a listing
 *
 * Protected route:
 * POST /api/ai/listing-assistant
 */
export async function generateListingAssistant(
  payload: ListingAssistantPayload
): Promise<ListingAssistantResult> {
  const { data } = await api.post(
    "/api/ai/listing-assistant",
    payload
  );

  return data.data;
}

/**
 * =========================================================
 * CREATE LISTING
 * =========================================================
 */

export interface CreateListingPayload {
  title: string;
  description: string;
  categoryId: string;
  price: number | string;
  currency?: string;
  condition: string;
  faultSeverity?: string;
  faultDescription?: string;
  location?: string;
  state?: string;
  city?: string;
  negotiable?: boolean;
  images?: File[];
}

/**
 * Create a new listing
 *
 * Protected route:
 * POST /api/listings
 *
 * Uses multipart/form-data because images are uploaded.
 */
export async function createListing(
  payload: CreateListingPayload
) {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append(
    "description",
    payload.description
  );
  formData.append(
    "categoryId",
    payload.categoryId
  );
  formData.append("price", String(payload.price));

  if (payload.currency) {
    formData.append(
      "currency",
      payload.currency
    );
  }

  formData.append(
    "condition",
    payload.condition
  );

  if (payload.faultSeverity) {
    formData.append(
      "faultSeverity",
      payload.faultSeverity
    );
  }

  if (payload.faultDescription) {
    formData.append(
      "faultDescription",
      payload.faultDescription
    );
  }

  if (payload.location) {
    formData.append(
      "location",
      payload.location
    );
  }

  if (payload.state) {
    formData.append(
      "state",
      payload.state
    );
  }

  if (payload.city) {
    formData.append(
      "city",
      payload.city
    );
  }

  if (payload.negotiable !== undefined) {
    formData.append(
      "negotiable",
      String(payload.negotiable)
    );
  }

    if (payload.images) {
    payload.images.forEach((file) => {
      formData.append("images", file);
    });
  }

  console.log(
    "CREATE LISTING FILES:",
    payload.images
  );

  console.log(
    "FORMDATA:",
    Array.from(formData.entries()).map(
      ([key, value]) => [
        key,
        value instanceof File
          ? {
              name: value.name,
              type: value.type,
              size: value.size,
            }
          : value,
      ]
    )
  );

  const { data } = await api.post(
    "/api/listings",
    formData
  );

  return data.data;
}

/**
 * =========================================================
 * UPDATE LISTING
 * =========================================================
 */

export interface UpdateListingPayload {
  title?: string;
  description?: string;
  categoryId?: string;
  price?: number | string;
  currency?: string;
  condition?: string;
  faultSeverity?: string;
  faultDescription?: string;
  location?: string;
  state?: string;
  city?: string;
  negotiable?: boolean;
  images?: File[];
}

/**
 * Update a listing
 *
 * Protected route:
 * PUT /api/listings/:id
 *
 * Uses multipart/form-data because new images
 * can be uploaded.
 *
 * If images are supplied, the backend replaces
 * the existing image set.
 */
export async function updateListing(
  id: string,
  payload: UpdateListingPayload
) {
  const formData = new FormData();

  if (payload.title !== undefined) {
    formData.append("title", payload.title);
  }

  if (payload.description !== undefined) {
    formData.append(
      "description",
      payload.description
    );
  }

  if (payload.categoryId !== undefined) {
    formData.append(
      "categoryId",
      payload.categoryId
    );
  }

  if (payload.price !== undefined) {
    formData.append(
      "price",
      String(payload.price)
    );
  }

  if (payload.currency !== undefined) {
    formData.append(
      "currency",
      payload.currency
    );
  }

  if (payload.condition !== undefined) {
    formData.append(
      "condition",
      payload.condition
    );
  }

  if (payload.faultSeverity !== undefined) {
    formData.append(
      "faultSeverity",
      payload.faultSeverity
    );
  }

  if (
    payload.faultDescription !== undefined
  ) {
    formData.append(
      "faultDescription",
      payload.faultDescription
    );
  }

  if (payload.location !== undefined) {
    formData.append(
      "location",
      payload.location
    );
  }

  if (payload.state !== undefined) {
    formData.append(
      "state",
      payload.state
    );
  }

  if (payload.city !== undefined) {
    formData.append(
      "city",
      payload.city
    );
  }

  if (payload.negotiable !== undefined) {
    formData.append(
      "negotiable",
      String(payload.negotiable)
    );
  }

  if (payload.images) {
    payload.images.forEach((file) => {
      formData.append("images", file);
    });
  }

  console.log(
    "UPDATE LISTING:",
    id
  );

  console.log(
    "UPDATE FILES:",
    payload.images
  );

  const { data } = await api.put(
    `/api/listings/${id}`,
    formData
  );

  return data.data;
}
/**
 * =========================================================
 * DELETE LISTING
 * =========================================================
 */

/**
 * Delete a listing
 *
 * Protected route:
 * DELETE /api/listings/:id
 */
export async function deleteListing(id: string) {
  const { data } = await api.delete(
    `/api/listings/${id}`
  );

  return data.data;
}

/**
 * =========================================================
 * CATEGORIES
 * =========================================================
 */

/**
 * Get categories
 */
export async function getCategories() {
  const res = await fetch(
    `${API_URL}/api/categories`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to fetch categories"
    );
  }

  const data = await res.json();

  return data.data;
}

/**
 * Get category listings
 */
export async function getCategoryListings(
  slug: string,
  searchParams?: Record<string, string>
) {
  const params = new URLSearchParams(
    searchParams
  );

  const queryString = params.toString();

  const res = await fetch(
    `${API_URL}/api/categories/${slug}/listings${
      queryString ? `?${queryString}` : ""
    }`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to fetch category"
    );
  }

  const data = await res.json();

  return data.data;
}

/**
 * =========================================================
 * SELLER DASHBOARD
 * =========================================================
 */

/**
 * Seller Dashboard
 *
 * Protected route
 */
export async function getSellerDashboard() {
  const { data } = await api.get(
    "/api/dashboard"
  );

  return data.data;
}

/**
 * =========================================================
 * AUTHENTICATION
 * =========================================================
 */

export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Login user
 */
export async function loginUser(
  payload: LoginPayload
) {
  const res = await fetch(
    `${API_URL}/api/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Login failed"
    );
  }

  if (
    data.accessToken &&
    data.user
  ) {
    useAuthStore
      .getState()
      .setAuth(
        data.user,
        data.accessToken
      );
  }

  return data;
}

/**
 * Register a new user
 *
 * POST /api/auth/register
 */
export async function registerUser(data: {
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  phone?: string;
  password: string;
}) {
  const response = await api.post("/api/auth/register", data);

  return response.data;
}

/**
 * =========================================================
 * ADMIN DASHBOARD
 * =========================================================
 */

/**
 * Admin Dashboard
 *
 * Protected route
 */
export async function getAdminDashboard() {
  const { data } = await api.get(
    "/api/admin/dashboard"
  );

  return data.data;
}

/**
 * =========================================================
 * ADMIN USERS
 * =========================================================
 */

/**
 * Get admin users
 */
export async function getAdminUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  const { data } = await api.get(
    "/api/admin/users",
    {
      params,
    }
  );

  return data.data;
}

/**
 * Update admin user status
 */
export async function updateAdminUserStatus(
  id: string,
  status:
    | "PENDING"
    | "ACTIVE"
    | "SUSPENDED"
    | "BANNED"
) {
  const { data } = await api.patch(
    `/api/admin/users/${id}/status`,
    {
      status,
    }
  );

  return data.data;
}

/**
 * =========================================================
 * ADMIN LISTINGS
 * =========================================================
 */

/**
 * Approve Listing
 */
export async function approveListing(
  id: string
) {
  const { data } = await api.patch(
    `/api/admin/listings/${id}/approve`
  );

  return data.data;
}

/**
 * Reject Listing
 */
export async function rejectListing(
  id: string
) {
  const { data } = await api.patch(
    `/api/admin/listings/${id}/reject`
  );

  return data.data;
}

/**
 * =========================================================
 * ADMIN LISTINGS
 * =========================================================
 */

/**
 * Get admin listings
 */
export async function getAdminListings(
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }
) {
  const { data } = await api.get(
    "/api/admin/listings",
    {
      params,
    }
  );

  return data.data;
}

/**
 * =========================================================
 * ADMIN ORDERS
 * =========================================================
 */

/**
 * Get admin orders
 */
export async function getAdminOrders(
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }
) {
  const { data } = await api.get(
    "/api/admin/orders",
    {
      params,
    }
  );

  return data.data;
}

/**
 * Get a single admin order
 */
export async function getAdminOrderById(
  id: string
) {
  const { data } = await api.get(
    `/api/admin/orders/${id}`
  );

  return data.data;
}
/**
 * =========================================================
 * ADMIN REPORTS
 * =========================================================
 */

/**
 * Get admin reports
 */
export async function getAdminReports(
  params?: {
    page?: number;
    limit?: number;
    status?: string;
  }
) {
  const { data } = await api.get(
    "/api/admin/reports",
    {
      params,
    }
  );

  return data.data;
}

/**
 * Update admin report status
 */
export async function updateAdminReportStatus(
  id: string,
  status:
    | "PENDING"
    | "UNDER_REVIEW"
    | "ACTION_TAKEN"
    | "DISMISSED"
) {
  const { data } = await api.patch(
    `/api/admin/reports/${id}/status`,
    {
      status,
    }
  );

  return data.data;
}

/**
 * =========================================================
 * ADMIN AUDIT LOGS
 * =========================================================
 */

/**
 * Get audit logs
 */
export async function getAuditLogs(
  params?: {
    page?: number;
    limit?: number;
  }
) {
  const { data } = await api.get(
    "/api/audit",
    {
      params,
    }
  );

  return data.data;
}
/**
 * Create or get an existing conversation
 */
export async function createConversation(
  listingId: string,
  sellerId: string
) {
  const { data } = await api.post(
    "/api/conversations",
    {
      listingId,
      sellerId,
    }
  );

  return data.data;
}

/**
 * Get my conversations
 */
export async function getMyConversations() {
  const { data } = await api.get(
    "/api/conversations"
  );

  return data.data;
}

/**
 * Get a conversation by ID
 */
export async function getConversation(
  conversationId: string
) {
  const { data } = await api.get(
    `/api/conversations/${conversationId}`
  );

  return data.data;
}

/**
 * Get messages in a conversation
 */
export async function getMessages(
  conversationId: string
) {
  const { data } = await api.get(
    `/api/messages/${conversationId}`
  );

  return data.data;
}

/**
 * =========================================================
 * TRUST & SAFETY / REPORTS
 * =========================================================
 */

/**
 * Create a report
 *
 * Protected route:
 * POST /api/reports
 */
export async function createReport(data: {
  listingId?: string;
  reportedUserId?: string;
  reason: string;
  description?: string;
}) {
  const { data: response } = await api.post(
    "/api/reports",
    data
  );

  return response.data;
}

/**
 * Get reports submitted by the current user
 *
 * Protected route:
 * GET /api/reports/me
 */
export async function getMyReports() {
  const { data } = await api.get(
    "/api/reports/me"
  );

  return data.data;
}

/**
 * Get a single report submitted by the current user
 *
 * Protected route:
 * GET /api/reports/:id
 */
export async function getReportById(
  reportId: string
) {
  const { data } = await api.get(
    `/api/reports/${reportId}`
  );

  return data.data;
}

/**
 * Delete a report
 *
 * Protected route:
 * DELETE /api/reports/:id
 */
export async function deleteReport(
  reportId: string
) {
  const { data } = await api.delete(
    `/api/reports/${reportId}`
  );

  return data.data;
}

/**
 * =========================================================
 * OFFERS
 * =========================================================
 */

export interface CreateOfferPayload {
  listingId: string;
  amount: number;
  message?: string;
}

/**
 * Create an offer on a listing
 *
 * Protected route:
 * POST /api/offers
 */
export async function createOffer(
  payload: CreateOfferPayload
) {
  const { data } = await api.post(
    "/api/offers",
    payload
  );

  return data.data;
}

/**
 * Get offers made by the current buyer
 *
 * Protected route:
 * GET /api/offers/my
 */
export async function getMyOffers() {
  const { data } = await api.get(
    "/api/offers/my"
  );

  return data.data;
}

/**
 * Get offers received by the current seller
 *
 * Protected route:
 * GET /api/offers/received
 */
export async function getReceivedOffers() {
  const { data } = await api.get(
    "/api/offers/received"
  );

  return data.data;
}

/**
 * Accept an offer
 *
 * Protected route:
 * PATCH /api/offers/:id/accept
 */
export async function acceptOffer(
  offerId: string
) {
  const { data } = await api.patch(
    `/api/offers/${offerId}/accept`
  );

  return data.data;
}

/**
 * Reject an offer
 *
 * Protected route:
 * PATCH /api/offers/:id/reject
 */
export async function rejectOffer(
  offerId: string
) {
  const { data } = await api.patch(
    `/api/offers/${offerId}/reject`
  );

  return data.data;
}

/**
 * Withdraw an offer
 *
 * Protected route:
 * PATCH /api/offers/:id/withdraw
 */
export async function withdrawOffer(
  offerId: string
) {
  const { data } = await api.patch(
    `/api/offers/${offerId}/withdraw`
  );

  return data.data;
}
/**
 * Send a message
 */
export async function sendMessage(
  conversationId: string,
  content: string
) {
  const { data } = await api.post(
    `/api/messages/${conversationId}`,
    {
      content,
    }
  );

  return data.data;
}

/**
 * Mark a message as read
 */
export async function markMessageAsRead(
  messageId: string
) {
  const { data } = await api.patch(
    `/api/messages/${messageId}/read`
  );

  return data.data;
}

/**
 * Delete a message
 */
export async function deleteMessage(
  messageId: string
) {
  const { data } = await api.delete(
    `/api/messages/${messageId}`
  );

  return data.data;
}

/**
 * =========================================================
 * ORDERS
 * =========================================================
 */

/**
 * Get current user's orders
 *
 * Protected route:
 * GET /api/orders
 *
 * Returns orders where the authenticated user
 * is either the buyer or seller.
 */
export async function getMyOrders() {
  const { data } = await api.get("/api/orders");

  return data.data;
}

/**
 * Create a review for a completed order
 *
 * Protected route:
 * POST /api/reviews
 */
export interface CreateReviewPayload {
  orderId: string;
  rating: number;
  comment?: string;
  type: "BUYER_TO_SELLER" | "SELLER_TO_BUYER";
}

export async function createReview(
  payload: CreateReviewPayload
) {
  const { data } = await api.post(
    "/api/reviews",
    payload
  );

  return data.data;
}

/**
 * Get reviews received by a user
 *
 * GET /api/reviews/user/:userId
 */
export async function getUserReviews(
  userId: string,
  page = 1,
  limit = 20
) {
  const { data } = await api.get(
    `/api/reviews/user/${userId}`,
    {
      params: {
        page,
        limit,
      },
    }
  );

  return data.data;
}

/**
 * Get rating summary for a user
 *
 * GET /api/reviews/summary/:userId
 */
export async function getRatingSummary(
  userId: string
) {
  const { data } = await api.get(
    `/api/reviews/summary/${userId}`
  );

  return data.data;
}

/**
 * Update an existing review
 *
 * Protected route:
 * PATCH /api/reviews/:id
 */
export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export async function updateReview(
  reviewId: string,
  payload: UpdateReviewPayload
) {
  const { data } = await api.patch(
    `/api/reviews/${reviewId}`,
    payload
  );

  return data.data;
}

/**
 * Delete an existing review
 *
 * Protected route:
 * DELETE /api/reviews/:id
 */
export async function deleteReview(
  reviewId: string
) {
  const { data } = await api.delete(
    `/api/reviews/${reviewId}`
  );

  return data.data;
}
/**
 * Get a single order
 *
 * Protected route:
 * GET /api/orders/:id
 */
export async function getOrderById(orderId: string) {
  const { data } = await api.get(
    `/api/orders/${orderId}`
  );

  return data.data;
}

/**
 * Confirm that the buyer has received and inspected
 * the item or service.
 *
 * Protected route:
 * PATCH /api/orders/:id/confirm-receipt
 */
export async function confirmOrderReceipt(orderId: string) {
  const { data } = await api.patch(
    `/api/orders/${orderId}/confirm-receipt`
  );

  return data.data;
}
/**
 * Create an order
 *
 * Protected route:
 * POST /api/orders
 */
export async function createOrder(data: {
  listingId: string;
  offerId?: string;
  shippingAddress?: string;
}) {
  const response = await api.post(
    "/api/orders",
    data
  );

  return response.data.data;
}

/**
 * Update order status
 *
 * Protected route:
 * PATCH /api/orders/:id/status
 */
export async function updateOrderStatus(
  orderId: string,
  status: string
) {
  const { data } = await api.patch(
    `/api/orders/${orderId}/status`,
    {
      status,
    }
  );

  return data.data;
}

/**
 * Cancel an order
 *
 * Protected route:
 * PATCH /api/orders/:id/cancel
 */
export async function cancelOrder(
  orderId: string
) {
  const { data } = await api.patch(
    `/api/orders/${orderId}/cancel`
  );

  return data.data;
}

/**
 * Buyer confirms receipt of an order
 *
 * Protected route:
 * PATCH /api/orders/:id/confirm-receipt
 */
export async function confirmReceipt(orderId: string) {
  const { data } = await api.patch(
    `/api/orders/${orderId}/confirm-receipt`
  );

  return data.data;
}

/**
 * =========================================================
 * CAREERS
 * =========================================================
 */

export interface CareerJob {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  salaryRange?: string | null;
  description: string;
  responsibilities: string;
  requirements: string;
}

export async function getCareers(params?: {
  search?: string;
  department?: string;
  employmentType?: string;
  page?: number;
  limit?: number;
}): Promise<{
  jobs: CareerJob[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  const searchParams = new URLSearchParams();

  if (params?.search) {
    searchParams.set("search", params.search);
  }

  if (params?.department) {
    searchParams.set("department", params.department);
  }

  if (params?.employmentType) {
    searchParams.set("employmentType", params.employmentType);
  }

  if (params?.page) {
    searchParams.set("page", String(params.page));
  }

  if (params?.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();

  const res = await fetch(
    `${API_URL}/api/careers/jobs${query ? `?${query}` : ""}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Careers fetch failed: ${res.status}`);
  }

  const data = await res.json();

  return data.data;
}

export async function getCareerBySlug(
  slug: string
): Promise<CareerJob> {
  const res = await fetch(
    `${API_URL}/api/careers/jobs/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Job fetch failed: ${res.status}`);
  }

  const data = await res.json();

  return data.data;
}
/**
 * =========================================================
 * CURRENT USER PROFILE
 * =========================================================
 */

/**
 * Get current user's profile
 */
export async function getMyProfile() {
  const { data } = await api.get("/api/users/me");

  return data.user;
}

/**
 * Update current user's profile
 */
export async function updateMyProfile(profileData: {
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  gender?: string | null;
  profileImage?: string | null;
  bio?: string | null;
}) {
  const { data } = await api.patch(
    "/api/users/me",
    profileData
  );

  return data.user;
}

/**
 * Change current user's password
 */
export async function changeMyPassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  const response = await api.patch(
    "/api/users/change-password",
    data
  );

  return response.data;
}

/**
 * Delete current user's account
 */
export async function deleteMyAccount() {
  const { data } = await api.delete("/api/users/me");

  return data;
}