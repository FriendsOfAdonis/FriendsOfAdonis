import vine from '@vinejs/vine'

export const ACTION_VALIDATOR = vine.object({
  method: vine.string(),
  params: vine.array(vine.any()),
})

export const ACTIONS_VALIDATOR = vine.array(ACTION_VALIDATOR)
