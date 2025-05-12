export function formatPhoneNumber(phone: string | number) {
  const cleaned = phone.toString().replace(/\D/g, '')

  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }

  return phone
}
