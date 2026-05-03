# MongoDB Usage Guide

This is a GitHub-friendly reference for the MongoDB features used in `backend/src`. It is organized so you can quickly scan the feature type, jump to the exact file, and understand why each query or index exists.

> Tip: click any file link to open the exact source line in the editor.

## Quick Map

| Section | What you get |
|---|---|
| [CRUD Operations](#crud-operations) | Create, read, update, and delete actions used in the backend. |
| [Array Operations](#array-operations) | `$push`, `$pull`, `$addToSet`, `$all`, `$inc`, and `$size`. |
| [Logical Operators](#logical-operators) | `$and`, `$or`, and `$nor` query patterns. |
| [Comparison Operators](#comparison-operators) | `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, and `$regex`. |
| [Element Operators](#element-operators) | `$exists` and `$type` checks. |
| [Index Types](#index-types) | Single-field, compound, text, geospatial, and multikey indexes. |
| [Aggregation Pipelines](#aggregation-pipelines) | Message, post, and wallet analytics pipelines. |

## Contents

1. [CRUD Operations](#crud-operations)
2. [Array Operations](#array-operations)
3. [Logical Operators](#logical-operators)
4. [Comparison Operators](#comparison-operators)
5. [Element Operators](#element-operators)
6. [Index Types](#index-types)
7. [Aggregation Pipelines](#aggregation-pipelines)

## CRUD Operations

### Create

| File and lines | What happens |
|---|---|
| [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L35) | Creates a new `Driver` document with embedded profile and location data when a driver registers. |
| [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L56) and [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L80) | Creates a new `Post` document with embedded comments and analytics structure. |
| [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L10) and [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L27) | Creates a new `Conversation` document and initializes conversation settings. |
| [backend/src/routes/walletRoutes.js](backend/src/routes/walletRoutes.js#L50) and [backend/src/routes/walletRoutes.js](backend/src/routes/walletRoutes.js#L66) | Creates a credit transaction and updates the wallet balance. |
| [backend/src/routes/walletRoutes.js](backend/src/routes/walletRoutes.js#L112) | Creates a debit transaction after checking balance and account suffix. |

### Read

| File and lines | What happens |
|---|---|
| [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L30) | Reads a driver by phone number using `$eq`. |
| [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L162) | Reads drivers using a combined `$and` + `$or` search across name, car model, trust score, and activity state. |
| [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L280) | Reads inactive drivers using `$ne`. |
| [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L293) | Reads high-performing drivers using `$gt` and `$lt`. |
| [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L40) | Reads published posts while checking that the flag exists. |
| [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L233) | Reads posts with a combined logical search filter. |
| [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L403) | Reads posts by field type using `$type`. |
| [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L19) | Reads conversations where both participants are present using `$all`. |
| [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L55) | Reads active conversations using `$ne` and embedded settings. |
| [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L350) | Reads search results across message content using `$or` and `$regex`. |
| [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L370) | Reads recent messages using `$gt` on timestamps. |
| [backend/src/routes/walletRoutes.js](backend/src/routes/walletRoutes.js#L38) | Reads a wallet and its transactions. |
| [backend/src/routes/walletRoutes.js](backend/src/routes/walletRoutes.js#L287) | Reads transactions with mixed range filters and optional type/verification logic. |

### Update

| File and lines | What happens |
|---|---|
| [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L65) | Updates a driver during login/register flows when the record already exists. |
| [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L201) | Updates the `tags` array using `$addToSet` so tags stay unique. |
| [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L244) | Updates the embedded `currentLocation` document as GeoJSON. |
| [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L123) | Updates votes and uses comparison logic to control moderation behavior. |
| [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L155) | Adds a comment to the `comments` array using `$push`. |
| [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L206) | Removes a comment from the `comments` array using `$pull`. |
| [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L139) | Increments conversation `messageCount` using `$inc`. |
| [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L172) | Marks messages as read by updating embedded message fields. |
| [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L190) | Adds a reaction to `metadata.reactions` with `$push`. |
| [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L396) | Removes a reaction from `metadata.reactions` with `$pull`. |
| [backend/src/routes/walletRoutes.js](backend/src/routes/walletRoutes.js#L59) | Increments wallet balance with `$inc`. |
| [backend/src/routes/walletRoutes.js](backend/src/routes/walletRoutes.js#L87) | Decrements wallet balance after checking available funds. |
| [backend/src/routes/walletRoutes.js](backend/src/routes/walletRoutes.js#L233) | Adds a tag to a transaction using `$push`. |
| [backend/src/routes/walletRoutes.js](backend/src/routes/walletRoutes.js#L262) | Removes a tag from a transaction using `$pull`. |

### Delete

| File and lines | What happens |
|---|---|
| [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L260) | Deletes a driver record. |
| [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L137) | Deletes a post when moderation thresholds are reached. |
| [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L206) | Deletes a comment from the embedded comments array. |
| [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L219) and [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L225) | Soft-deletes a message by marking it as deleted. |
| [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L396) | Removes a reaction from a message. |
| [backend/src/routes/walletRoutes.js](backend/src/routes/walletRoutes.js#L262) | Removes a tag from a transaction. |

## Array Operations

Array operators are used whenever the code works with lists such as tags, comments, participants, or reactions.

| Operator | File and lines | Purpose in this project |
|---|---|---|
| `$all` | [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L19), [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L465) | Ensures a document contains all required values in an array, such as both participants in a conversation. |
| `$addToSet` | [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L201), [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L374) | Adds a tag only if it does not already exist, which prevents duplicates. |
| `$push` | [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L155), [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L190), [backend/src/routes/walletRoutes.js](backend/src/routes/walletRoutes.js#L233) | Appends a new item to an array, such as a comment, reaction, or transaction tag. |
| `$pull` | [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L206), [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L396), [backend/src/routes/walletRoutes.js](backend/src/routes/walletRoutes.js#L262) | Removes matching items from an array. |
| `$inc` | [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L139), [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L155), [backend/src/routes/walletRoutes.js](backend/src/routes/walletRoutes.js#L59) | Increments counters such as balance, message count, or engagement score. |
| `$size` | [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L20), [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L326) | Checks the size of an array or computes array length in aggregation. |

Why these matter: array operators keep embedded lists inside a single MongoDB document synchronized without separate tables. That fits use cases like post comments, message reactions, transaction tags, and conversation participants.

## Logical Operators

Logical operators combine multiple conditions into a single query.

| Operator | File and lines | Purpose in this project |
|---|---|---|
| `$and` | [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L171), [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L242), [backend/src/routes/walletRoutes.js](backend/src/routes/walletRoutes.js#L297) | Requires every condition in the array to be true. Used for range filtering and combined search constraints. |
| `$or` | [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L184), [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L251), [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L354), [backend/src/routes/walletRoutes.js](backend/src/routes/walletRoutes.js#L305) | Allows any one of several conditions to match. Used for text search and optional filters. |
| `$nor` | [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L266), [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L426), [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L434) | Matches documents that satisfy none of the listed conditions. Useful for finding inactive or neutral records. |

Practical example: the driver search route combines `$and` for score ranges and `$or` for matching either `name` or `carModel`, so the result set stays narrow but still supports flexible search input.

## Comparison Operators

Comparison operators are used to filter by exact equality, ranges, and thresholds.

| Operator | File and lines | Meaning in the code |
|---|---|---|
| `$eq` | [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L30), [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L281), [backend/src/routes/walletRoutes.js](backend/src/routes/walletRoutes.js#L142) | Exact match. Used for phone lookup, published-post checks, and driver transaction filtering. |
| `$ne` | [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L285), [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L255) | Not equal. Used for inactive drivers and soft-deleted messages. |
| `$gt` | [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L299), [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L319), [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L383) | Greater than. Used for score thresholds, positive upvote filtering, and recent timestamps. |
| `$gte` | [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L173), [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L245), [backend/src/routes/walletRoutes.js](backend/src/routes/walletRoutes.js#L102) | Greater than or equal. Used for minimum trust score, vote ranges, and balance checks before withdrawal. |
| `$lt` | [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L301) | Less than. Used to find drivers with fewer alerts. |
| `$lte` | [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L174), [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L246) | Less than or equal. Used for upper-bound filtering in score and vote ranges. |
| `$in` | [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L174), [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L353) | Matches any value in a list. Used for bulk message updates and conversation lookup. |
| `$regex` | [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L185), [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L252), [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L355) | Text matching with case-insensitive search. |

## Element Operators

Element operators check field presence and type.

| Operator | File and lines | Purpose in this project |
|---|---|---|
| `$exists` | [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L45), [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L230), [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L91) | Verifies that a field exists before using it in a query or update. |
| `$type` | [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L230), [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L409) | Ensures a field has a specific BSON type, such as string. |

Why these matter: they prevent queries from treating missing data as valid data, especially when some documents have embedded structures and some do not.

## Index Types

Indexes are defined in the Mongoose models and support the queries above.

### Driver model indexes

| File and lines | Index type | Why it exists |
|---|---|---|
| [backend/src/models/Driver.js](backend/src/models/Driver.js#L65) | Single-field | Speeds up phone lookups. |
| [backend/src/models/Driver.js](backend/src/models/Driver.js#L68) | Text index | Supports search on `name` and `carModel`. |
| [backend/src/models/Driver.js](backend/src/models/Driver.js#L71) | Compound index | Supports queries on `trustScore` and `isActive`. |
| [backend/src/models/Driver.js](backend/src/models/Driver.js#L74) | Geospatial index | Supports location-based queries using GeoJSON `currentLocation`. |
| [backend/src/models/Driver.js](backend/src/models/Driver.js#L77) | Multikey index | Supports lookups on the `tags` array. |

### Post model indexes

| File and lines | Index type | Why it exists |
|---|---|---|
| [backend/src/models/Post.js](backend/src/models/Post.js#L67) | Single-field | Speeds up category lookups. |
| [backend/src/models/Post.js](backend/src/models/Post.js#L70) | Text index | Supports full-text search on `title` and `description`. |
| [backend/src/models/Post.js](backend/src/models/Post.js#L73) | Compound index | Optimizes author + publication-state queries. |
| [backend/src/models/Post.js](backend/src/models/Post.js#L76) | Compound index | Helps category queries that also sort by `createdAt`. |
| [backend/src/models/Post.js](backend/src/models/Post.js#L79) | Multikey index | Supports filtering by `tags`. |

### Transaction model indexes

| File and lines | Index type | Why it exists |
|---|---|---|
| [backend/src/models/Transaction.js](backend/src/models/Transaction.js#L42) | Single-field | Speeds up all transactions for one driver. |
| [backend/src/models/Transaction.js](backend/src/models/Transaction.js#L45) | Compound index | Optimizes queries by driver and transaction type. |
| [backend/src/models/Transaction.js](backend/src/models/Transaction.js#L48) | Compound index | Improves time-based transaction listing for a driver. |

### Message model indexes

| File and lines | Index type | Why it exists |
|---|---|---|
| [backend/src/models/Message.js](backend/src/models/Message.js#L46) | Single-field | Speeds up conversation message retrieval. |
| [backend/src/models/Message.js](backend/src/models/Message.js#L49) | Compound index | Supports ordered message history by conversation and time. |
| [backend/src/models/Message.js](backend/src/models/Message.js#L52) | Compound index | Optimizes sender-based queries and read-status filtering. |

### Conversation model indexes

| File and lines | Index type | Why it exists |
|---|---|---|
| [backend/src/models/Conversation.js](backend/src/models/Conversation.js#L42) | Multikey index | Supports matching conversations by participant list. |
| [backend/src/models/Conversation.js](backend/src/models/Conversation.js#L45) | Compound index | Supports participant lookup plus latest-message sorting. |

### Detailed index notes

Indexes are only added where the application repeatedly filters, sorts, or searches by the same fields. That is the reason the code indexes `phone`, `category`, `driverId`, `conversationId`, `tags`, and `currentLocation` instead of every field in every schema. Indexing every field would waste storage and slow down writes, while these selected fields directly support the actual route queries.

#### Single-field indexes

Single-field indexes are used when one field is the main lookup key.

- `Driver.phone` is indexed because login and registration always begin with a phone lookup. It makes `findOne({ phone })` fast and keeps user lookup stable.
- `Post.category` is indexed because the app repeatedly filters posts by category such as `ride` or `alert`. It helps category feeds and category statistics.
- `Transaction.driverId` is indexed because wallet pages read all transactions for one driver. It speeds up driver-specific transaction history.
- `Message.conversationId` is indexed because chat screens load messages for one conversation at a time. It keeps message retrieval fast even when the message collection grows large.

What it achieves: quicker exact match queries with low complexity. Why this field is indexed: each one is a frequent entry point in the backend, so MongoDB benefits from direct key access instead of collection scans.

#### Text indexes

Text indexes are used for content that users search by words rather than exact values.

- `Driver.name` and `Driver.carModel` are indexed together because driver discovery often depends on human-readable search terms.
- `Post.title` and `Post.description` are indexed together because posts are searched by their content.

What it achieves: tokenized full-text search support and ranking. Why these fields are indexed: they contain natural-language text, which is better suited to search indexes than normal equality lookups. If the app later switches from regex filtering to `$text` search, these indexes will become even more valuable.

#### Compound indexes

Compound indexes combine multiple fields into one index. They are useful when queries usually filter by more than one field at once, and the order of the fields matters.

- `Driver.trustScore + isActive` is used when the app wants active drivers ordered or filtered by reputation. The first field should be the one that most often drives the query, so trust score comes first.
- `Post.authorId + isPublished` is useful when loading a driver's own published posts. It supports author dashboards and avoids scanning unpublished content.
- `Post.category + createdAt` supports category-based feeds sorted by newest posts. The category filter narrows the set first, then the date order makes feed rendering cheaper.
- `Transaction.driverId + type` helps when the wallet view needs credits and debits grouped by a driver.
- `Transaction.driverId + createdAt` helps when the wallet view lists a driver's transaction history in reverse time order.
- `Message.conversationId + createdAt` is ideal for chat history because it reads the right conversation and returns messages in timeline order.
- `Message.senderId + metadata.isRead` helps message analytics where sender identity and read status are both part of the filter.
- `Conversation.participants + lastMessageAt` helps inbox-style conversation lists where MongoDB must first match the participant set and then sort by the latest activity.

What it achieves: fewer index lookups for multi-condition queries and faster sorting when the sort order matches the index order. Why these fields are indexed: they are the fields that appear together in the most important backend queries.

#### Geospatial index

`Driver.currentLocation` uses a `2dsphere` index because the location data is stored as GeoJSON `Point` coordinates. This is the correct index type when the app needs to support map-based features such as nearby driver search, distance calculations, or route-area filtering.

What it achieves: geospatial query support on longitude/latitude coordinates. Why this field is indexed: location is a special data type that needs its own index structure; a normal numeric index on latitude and longitude is not enough for true geographic queries.

#### Multikey index

Multikey indexes are used when the field is an array and each element may be queried independently.

- `Driver.tags` is indexed because tags are used for filtering or classification.
- `Post.tags` is indexed because posts can be grouped or filtered by multiple labels.
- `Conversation.participants` is indexed because conversation lookup depends on matching both participant IDs.

What it achieves: faster membership and array-content queries. Why these fields are indexed: arrays are common search surfaces in this app, and MongoDB can index each element separately so lookups such as `$all`, array membership checks, and participant matching remain efficient.

In short, the model indexes are chosen because they match real query patterns in the backend, not because the schema needs one of every type. That keeps reads fast without adding unnecessary write overhead.

## Aggregation Pipelines

Aggregation is used in the backend for analytics and grouped summaries. Each pipeline follows the same general flow: `$match` to narrow documents first, then `$group`, `$facet`, `$project`, `$sort`, or `$limit` depending on the output needed.

### Chat analytics

| File and lines | Pipeline | Explanation |
|---|---|---|
| [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L250) | Conversation stats | `$match` filters messages for one conversation, `$group` computes count and message length per sender, and `$sort` ranks senders by activity. |
| [backend/src/routes/chatRoutes.js](backend/src/routes/chatRoutes.js#L290) | Conversation analytics | `$match` filters messages that have metadata, then `$facet` splits the data into read-status counts, pinned messages, and reacted messages. |

### Post analytics

| File and lines | Pipeline | Explanation |
|---|---|---|
| [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L278) | Category stats | `$match` keeps only published posts, `$group` summarizes by category, and `$sort` ranks categories by volume. |
| [backend/src/routes/postRoutes.js](backend/src/routes/postRoutes.js#L314) | Top posts analysis | `$match` starts with published posts that have votes, `$addFields` computes `commentCount` and `engagementScore`, and `$facet` returns three views: top engagement, most commented, and category distribution. |

### Wallet analytics

| File and lines | Pipeline | Explanation |
|---|---|---|
| [backend/src/routes/walletRoutes.js](backend/src/routes/walletRoutes.js#L141) | Monthly summary | `$match` filters transactions for one driver, `$group` totals by transaction type, and `$sort` returns the types in order. |
| [backend/src/routes/walletRoutes.js](backend/src/routes/walletRoutes.js#L179) | Transaction analytics | `$match` filters by driver, then `$facet` produces high-value transactions, type distribution, and recent verified transactions. |

### Why aggregation is used here

Aggregation is a good fit when the application needs a summary instead of raw documents. In this project it is used for dashboards, reporting, and ranking. It reduces work on the client side because MongoDB returns already-grouped results.

## Summary

The backend uses MongoDB in a consistent way:

- CRUD handles the core document lifecycle.
- Array operators manage embedded lists like comments, tags, and reactions.
- Logical and comparison operators power search and filtering.
- Element operators protect queries from missing or wrong-shaped data.
- Indexes keep those queries fast.
- Aggregation turns raw documents into analytics output.

If you want, I can also split this into separate files like `backend/README.md` for backend-only docs and a shorter root `README.md` for the project overview.