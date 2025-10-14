# Fake Payment System Documentation

## Overview

This document describes the mock payment system implemented for development and demo purposes in the TYHH Education Platform.

## System Components

### Backend (TYHH BE)

- **Endpoint**: `POST /api/v1/payments/mock`
- **Controller**: `src/controllers/api/payment.controller.js`
- **Route**: `src/routes/api/payment.route.js`
- **Authentication**: Required (`requireAuth` middleware)

### Frontend (TYHH MUI)

- **Component**: `src/components/PaymentModal.jsx`
- **API**: `src/features/api/paymentsApi.js`
- **Integration**: `src/pages/CourseDetail.jsx`

## How to Use

### For Testing/Demo

1. Navigate to any course detail page (`/courses/{slug}`)
2. Click "Đăng ký khóa học" button
3. Fill in the payment form with test data
4. Use test card number: `4242 4242 4242 4242`
5. Use any future expiry date (e.g., `12/25`)
6. Use any 3-digit CVV (e.g., `123`)
7. Submit to simulate successful payment

### Test Card Numbers

| Card Number           | Brand            | Result  |
| --------------------- | ---------------- | ------- |
| `4242 4242 4242 4242` | Visa             | Success |
| `5555 5555 5555 4444` | Mastercard       | Success |
| `3782 822463 10005`   | American Express | Success |

### API Request/Response

**Request:**

```json
POST /api/v1/payments/mock
{
  "courseId": 123,
  "amount": 100000,
  "paymentMethod": {
    "type": "card",
    "name": "Nguyen Van A",
    "last4": "4242",
    "brand": "visa"
  },
  "metadata": {
    "email": "user@example.com",
    "courseName": "Course Title"
  },
  "simulate": "success"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "id": "mock_pay_1634567890_abc123",
    "status": "paid",
    "amount": 100000,
    "courseId": 123,
    "userId": 456,
    "paymentMethod": {
      "type": "card",
      "last4": "4242",
      "brand": "visa",
      "name": "Nguyen Van A"
    },
    "transactionId": "txn_1634567890",
    "createdAt": "2023-10-18T10:30:00.000Z",
    "receiptUrl": "/api/v1/payments/mock/receipt/mock_pay_1634567890_abc123",
    "metadata": {
      "isMock": true,
      "environment": "development"
    }
  }
}
```

**Response (Failure):**

```json
{
  "success": false,
  "message": "Payment failed: Insufficient funds or card declined",
  "data": {
    "errorCode": "payment_failed",
    "details": "This is a simulated payment failure for testing purposes"
  }
}
```

## Simulating Different Scenarios

You can control the payment outcome by setting the `simulate` parameter:

- `"success"` - Always succeed (default)
- `"failed"` - Always fail
- `"random"` - 10% chance of failure, 90% success

## Environment Configuration

Add these optional environment variables to customize behavior:

```bash
# Enable/disable mock payments
FAKE_PAYMENTS=true

# Admin notification emails (optional)
ADMIN_EMAIL=admin@example.com
```

## Database Integration

The mock payment system optionally creates enrollment records:

```sql
-- Creates enrollment when payment succeeds
INSERT INTO enrollments (userId, courseId, status, enrolledAt, paymentId)
VALUES (userId, courseId, 'active', NOW(), paymentId);
```

## Frontend Implementation

### PaymentModal Component Features

- **Form Validation**: Uses react-hook-form + yup schema
- **Card Formatting**: Auto-formats card numbers with spaces
- **Card Brand Detection**: Detects Visa, Mastercard, Amex
- **Loading States**: Shows processing animation
- **Success/Error Handling**: Different UI states for outcomes
- **MUI Integration**: Consistent with app design system

### Integration Steps

1. Import `PaymentModal` component
2. Add state for modal open/close
3. Add payment success handler
4. Connect to button click event
5. Pass course and user data as props

## Testing Scenarios

### Manual Testing

1. **Successful Payment**: Use test card `4242 4242 4242 4242`
2. **Payment Failure**: Change backend simulate parameter to `"failed"`
3. **Form Validation**: Try invalid card numbers, emails, etc.
4. **User Not Logged In**: Test redirect to login page
5. **Loading States**: Check UI during processing

### Automated Testing (Future)

- Unit tests for PaymentModal component
- Integration tests for payment API
- E2E tests for complete payment flow
- MSW mocks for isolated frontend testing

## Migration to Real Payment System

When ready to implement real payments (e.g., Stripe):

1. **Backend Changes**:

   - Replace mock controller with real payment provider
   - Add webhook handlers for payment events
   - Update environment variables for API keys
   - Add proper payment record storage

2. **Frontend Changes**:

   - Replace mock API calls with real payment provider SDK
   - Update form to handle 3D Secure authentication
   - Add proper error handling for real payment errors
   - Update validation for real card requirements

3. **Security Considerations**:
   - Never send real card data to your backend
   - Use HTTPS for all payment-related requests
   - Implement proper webhook signature verification
   - Add rate limiting and fraud detection

## Troubleshooting

### Common Issues

**"Payment API not found" (404)**

- Ensure backend server is running
- Check that payment routes are registered in `src/routes/api/index.js`
- Verify API base URL in frontend configuration

**"Authentication required" (401)**

- Ensure user is logged in before attempting payment
- Check that auth middleware is working correctly
- Verify JWT token is being sent with requests

**Form validation errors**

- Check yup schema in PaymentModal component
- Ensure all required fields are filled
- Verify card number format (must be 13-19 digits)

**Payment always fails**

- Check `simulate` parameter in request payload
- Verify backend controller logic
- Check console logs for error details

### Debug Mode

Enable debug logging by adding to backend controller:

```javascript
console.log('Payment request:', req.body)
console.log('User info:', req.user)
```

## Security Note

⚠️ **Important**: This is a MOCK payment system for development only. Never use this in production with real user data or real money transactions. Always implement proper payment security when moving to production.
