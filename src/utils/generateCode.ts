import crypto from "crypto"

/**
 * Generates a verification code for results
 * Example output: EDN-A4F9C2
 */

export const generateVerificationCode = (): string => {

  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase()

  const code = `EDN-${randomPart}`

  return code
}