# Small-Group Authentication and Data-Service Decision

## Selected service

**Supabase** is the preferred service for Training Ledger because its PostgreSQL data model suits plans, sessions, exercises, sets, and progress records, while its authentication and row-level security can keep every user’s records private.

## Current official free-tier facts

- Supabase lists a Free tier at $0 with 50,000 monthly active users, a 500 MB database, 5 GB egress, and two active projects; it notes that projects pause after one week of inactivity.
- Firebase lists a no-cost Spark plan with up to 50,000 monthly active users for authentication and Firestore no-cost usage including 1 GiB stored data, 50,000 reads/day, and 20,000 writes/day.
- Appwrite lists a $0 tier with 75,000 monthly active users, one database, 500,000 reads/month, 250,000 writes/month, and a one-week inactivity pause.

## Sources

- https://supabase.com/pricing
- https://firebase.google.com/pricing
- https://appwrite.io/pricing
