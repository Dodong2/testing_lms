//mag-notify ng deadline 1 day before
export function isDeadlineApproaching(deadline: Date): boolean {
    const now = new Date()
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    return deadline <= oneDayFromNow && deadline > now
}