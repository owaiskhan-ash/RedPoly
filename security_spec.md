# REDPOLY Security Specification (Payload-First Security TDD)

## 1. Data Invariants
1. A user account document `/users/{userId}` can only be created or updated by the verified owner (`request.auth.uid == userId` and `email_verified == true`), and `uid` and `createdAt` are immutable.
2. PII (`email`, `fullName`, `phone`, `address`, `pinCode`, `city`, `state`) is strictly isolated in `/users/{userId}/private/profile` and is never readable or writable by any other user.
3. Cart items (`/users/{userId}/cart/{itemId}`) and wishlist items (`/users/{userId}/wishlist/{itemId}`) require the parent `/users/{userId}` account to exist and must match an authentic catalog SKU name and price (`isValidCatalogueItem`).
4. Orders (`/users/{userId}/orders/{orderId}`) are immutable receipts (`allow update, delete: if false`) whose `total` equals `subtotal + shippingCost`, and line items (`/users/{userId}/orders/{orderId}/items/{itemId}`) require atomic batch creation with the parent order (`existsAfter` + `getAfter`).
5. No user may list `/users` or `/users/{userId}/private`, and all subcollection `list` rules enforce `resource.data.uid == request.auth.uid`.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Cross-user account spoof**: User A writes `/users/userB` with `{ uid: "userB", ... }` -> DENIED (`uid == request.auth.uid` fails).
2. **Ghost field injection (Shadow Update)**: Write `/users/userA` with extra `{ isAdmin: true }` -> DENIED (`hasOnly` rejects).
3. **Unverified email write**: Authenticated user with `email_verified: false` creates `/users/userA` -> DENIED (`isVerifiedOwner` requires `email_verified == true`).
4. **Immutable field mutation**: Update `/users/userA` changing `createdAt` or `uid` -> DENIED (`affectedKeys().hasOnly(...)` & equality check).
5. **PII leak attempt**: User B reads `/users/userA/private/profile` -> DENIED (`isOwner(userId)` fails).
6. **Price tampering in cart**: Create `/users/userA/cart/gel-storm` with `{ name: "GEL STORM", price: 1, quantity: 1 }` -> DENIED (`isValidCatalogueItem` requires `price == 1999`).
7. **Invalid quantity / Denial of Wallet**: Create `/users/userA/cart/bubble-gun` with `{ quantity: 999999 }` or 1KB document ID -> DENIED (`quantity <= 99`, `isValidId` <= 128 chars).
8. **XSS/external URL injection in wishlist**: Create `/users/userA/wishlist/bad` with `{ href: "https://evil.example", ... }` -> DENIED (`href` must match `^/[a-zA-Z0-9_\-/?=&]+$`).
9. **Client-supplied timestamp spoofing**: Create cart item with `updatedAt` in the past instead of `request.time` -> DENIED (`incoming().updatedAt == request.time`).
10. **Order total tampering**: Create `/users/userA/orders/ord1` with `subtotal: 1999, shippingCost: 30, total: 1` -> DENIED (`total == subtotal + shippingCost`).
11. **Order mutation after placement**: Update `/users/userA/orders/ord1` to `status: "cancelled"` -> DENIED (`allow update: if false`).
12. **Orphaned order item**: Create `/users/userA/orders/nonexistent/items/i1` without creating parent order in the same batch -> DENIED (`existsAfter` fails).
