# chat-backend-sdd backend implementation

## Scope

Implement the backend-only REST API for chat conversations and messages.
Frontend integration remains out of scope for this work unit.

## Endpoints

- `GET /api/conversations`
- `POST /api/conversations`
- `GET /api/conversations/:conversationId/messages`
- `POST /api/conversations/:conversationId/messages`

## Decisions

- Use existing Bearer authentication middleware for every chat route.
- Use UUID string identifiers because this backend already persists users and posts with string IDs.
- Persist conversations and messages in PostgreSQL through Sequelize.
- Enforce one conversation per `postId + ownerId + participantId` with a database unique index plus create-or-get fallback.
- Keep demo-safe string IDs for post authors and chat participants while the frontend still contains local/mock posts.
- Keep unread counts at `0`; read-state tracking is outside the backend scope for this slice.

## Backend tasks

- [x] Create conversation persistence model.
- [x] Create message persistence model.
- [x] Avoid duplicate conversations per post owner and participant.
- [x] Implement conversation list and create/reuse endpoints.
- [x] Implement message list and send endpoints.
- [x] Validate participant permissions for read/write.
- [x] Validate message text as trimmed, non-empty, max 500 characters.

## Validation

- Use `node --check` for changed JavaScript files.
- Use app load smoke check with `require('./src/app')`.
- Use DB smoke checks against `DATABASE_URL` without printing secrets.
- Do not treat `npm test` as success because the current script is a placeholder.
