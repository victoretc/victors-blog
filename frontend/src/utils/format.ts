export function getStars(assessment: number): string {
  return '★'.repeat(assessment) + '☆'.repeat(5 - assessment)
}

export function formatDate(dateString?: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

interface DisplayNameUser {
  firstName?: string
  lastName?: string
  email?: string
  username?: string
}

export function userDisplayName(user: DisplayNameUser): string {
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
  if (name) return name
  if (user.email) return user.email
  return user.username || 'Пользователь'
}
