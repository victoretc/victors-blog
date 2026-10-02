export function pluralize(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1]
  return forms[2]
}

export function memberLabel(count: number): string {
  return `${count} ${pluralize(count, ['участник', 'участника', 'участников'])}`
}

export function reviewLabel(count: number): string {
  return pluralize(count, ['отзыв', 'отзыва', 'отзывов'])
}

export function memberReadingText(memberCount: number, isCurrentUserMember: boolean): string {
  if (isCurrentUserMember) {
    const others = memberCount - 1
    if (others === 0) return 'Вы уже читаете'
    return `${memberLabel(others)} и вы уже читаете`
  }
  const verb = memberCount === 1 ? 'читает' : 'читают'
  return `${memberLabel(memberCount)} уже ${verb}`
}

export function pagesLabel(count: number): string {
  return `${count} ${pluralize(count, ['страница', 'страницы', 'страниц'])}`
}
