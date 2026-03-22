function isStripeEvent(event: object): event is Stripe.Event {
  return (
    typeof event === 'object' &&
    event !== null &&
    typeof event.type === 'string' &&
    typeof event.data === 'object' &&
    event.data !== null &&
    typeof event.id === 'string'
  )
}
