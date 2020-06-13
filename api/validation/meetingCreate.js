const Joi = require('joi')
module.exports = {
  createMeeting: {
    body: Joi.object({
      options: Joi.object({
        externalMeetingName: Joi.string().trim().min(1).max(50).required()
      }),
      attendees: Joi.array().items(Joi.object({
        name: Joi.string().trim().min(1).max(50).required()
      })
      ).min(1).max(4)
    })
  },
  addAttendee: {
    params: {
      meetingId: Joi.string().trim().min(1).max(50).required()
    },
    body: {
      attendees: Joi.array().items(Joi.object({
        name: Joi.string().trim().min(1).max(50).required()
      })).min(1).max(4)
    }
  },
  idInParam: {
    params: {
      meetingId: Joi.string().trim().min(1).max(50).required()
    }
  }
}
