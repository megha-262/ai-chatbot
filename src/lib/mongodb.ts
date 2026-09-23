import { MongoClient, Db, Collection } from 'mongodb';

const options = {};

let clientPromise: Promise<MongoClient> | undefined;

// Strips any credentials out of a driver error message before it's logged —
// defense in depth on top of the driver's own redaction, since we must never
// log the connection string or password.
function safeErrorMessage(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  return message.replace(/mongodb(\+srv)?:\/\/[^@\s]+@/gi, 'mongodb$1://<redacted>@');
}

// Our own error message to the client is intentionally generic (never reveal
// whether a failure was a network issue or an auth issue). This turns the
// same information into a plain-language hint for whoever is reading Vercel's
// Runtime Logs, so a real incident doesn't require decoding a raw error code.
function classifyForLogging(err: unknown): string {
  const name = err instanceof Error ? err.name : '';
  const code = err && typeof err === 'object' && 'code' in err ? (err as { code?: unknown }).code : undefined;
  const message = err instanceof Error ? err.message : '';

  if (code === 18 || /bad auth|authentication failed/i.test(message)) {
    return 'likely cause: wrong username/password in MONGODB_URI (check Atlas Database Access)';
  }
  if (/whitelist|not authorized.*network|ip.*address.*not/i.test(message)) {
    return 'likely cause: Atlas Network Access is blocking this connection';
  }
  if (name === 'MongoServerSelectionError' || /ENOTFOUND|querySrv/i.test(message)) {
    return 'likely cause: DNS/hostname unreachable — check the cluster host in MONGODB_URI';
  }
  if (name === 'MongoNetworkTimeoutError' || /timed? ?out/i.test(message)) {
    return 'likely cause: cluster unreachable or paused, or a network timeout';
  }
  return 'cause unclear from error name/code alone — see message above';
}

function connect(uri: string): Promise<MongoClient> {
  const newClient = new MongoClient(uri, options);
  return newClient
    .connect()
    .catch((err) => {
      // Enough detail to diagnose in Vercel's function logs (error name/code,
      // a plain-language hint, and a credential-redacted message), without
      // ever logging secrets.
      console.error(
        'MongoDB connection failed:',
        err instanceof Error ? err.name : typeof err,
        err && typeof err === 'object' && 'code' in err ? (err as { code?: unknown }).code : undefined,
        `(${classifyForLogging(err)})`,
        safeErrorMessage(err)
      );

      // Don't leave a rejected promise cached: on serverless, a single
      // transient failure (e.g. a cold-start network blip) would otherwise
      // permanently poison every subsequent request on this warm instance.
      // Clearing the cache lets the next request retry with a fresh attempt.
      clientPromise = undefined;
      if (process.env.NODE_ENV === 'development') {
        const globalWithMongo = global as typeof globalThis & {
          _mongoClientPromise?: Promise<MongoClient>;
        };
        globalWithMongo._mongoClientPromise = undefined;
      }

      throw err;
    });
}

function getClientPromise(): Promise<MongoClient> {
  if (clientPromise) return clientPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      globalWithMongo._mongoClientPromise = connect(uri);
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    clientPromise = connect(uri);
  }

  return clientPromise;
}

// Database helper functions
export async function getDatabase(): Promise<Db> {
  const client = await getClientPromise();
  return client.db('healthbot-ai');
}

export async function getChatCollection(): Promise<Collection> {
  const db = await getDatabase();
  return db.collection('chats');
}

export async function getUserCollection(): Promise<Collection> {
  const db = await getDatabase();
  return db.collection('users');
}

export async function getConversationCollection(): Promise<Collection> {
  const db = await getDatabase();
  return db.collection('conversations');
}