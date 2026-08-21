/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 7c1f8c20-a12d-4d9b-bc8e-123456789
 *
 *         userId:
 *           type: string
 *           example: user-id
 *
 *         title:
 *           type: string
 *           example: New offer received
 *
 *         message:
 *           type: string
 *           example: Someone made an offer on your vehicle
 *
 *         type:
 *           type: string
 *           enum:
 *             - OFFER_RECEIVED
 *             - OFFER_ACCEPTED
 *             - OFFER_REJECTED
 *             - NEW_MESSAGE
 *             - ORDER_CONFIRMED
 *             - DELIVERY_UPDATED
 *             - NEW_REVIEW
 *             - ADMIN_ACTION
 *
 *         referenceId:
 *           type: string
 *           nullable: true
 *
 *         referenceType:
 *           type: string
 *           nullable: true
 *
 *         isRead:
 *           type: boolean
 *           example: false
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 */