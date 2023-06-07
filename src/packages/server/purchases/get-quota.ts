import getPool from "@cocalc/database/pool";
import { getServerSettings } from "@cocalc/server/settings/server-settings";

// This is the overall max quota for the user.   The sum of their individual
// quotas is bounded by this.
export default async function getQuota(account_id: string) {
  const pool = getPool("medium");
  const { rows } = await pool.query(
    "SELECT purchase_quota, stripe_customer_id, email_address_verified, email_address FROM accounts WHERE account_id=$1",
    [account_id]
  );
  if (rows.length == 0) {
    // no such account
    return 0;
  }
  const {
    purchase_quota,
    stripe_customer_id,
    email_address_verified,
    email_address,
  } = rows[0];
  if (purchase_quota != null) {
    // a quota that was set by an admin, etc.
    return purchase_quota;
  }
  if (!stripe_customer_id) {
    // if no stripe customer info, then definitely no purchases allowed.
    return 0;
  }
  const { default_pay_as_you_go_quota, verify_emails } =
    await getServerSettings();
  if (verify_emails && !email_address_verified?.[email_address]) {
    // email not verified
    return 0;
  }
  return default_pay_as_you_go_quota;
}
