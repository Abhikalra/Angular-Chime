'use strict'
const ChimeVideo = require('../service/chime-video')
const uuid = require('uuid/v4')

/**
 * Creates an external meeting name
 */
const getMeetingExternalTitle = () => {
  return `chime-meeting:${uuid().substring(0, 8)}`
}

module.exports = {
  /**
   * Create a Chime meeting instance
   * @param {object[]} attendees list of attendees
   * @param {object} options options
   */
  async createMeeting (attendees = [], options = {}) {
    if (attendees.length > 4) {
      throw new Error('Meeting attendees cannot be more than four.')
    }
    const meetingAttendees = attendees.map(attendee => {
      const obj = {
        ExternalUserId: `${uuid().substring(0, 8)}:${attendee.name}`
      }
      attendee.ExternalUserId = obj.ExternalUserId
      return obj
    })
    const externalIdentifier = options.externalMeetingName || getMeetingExternalTitle()
    const meeting = (await ChimeVideo.createMeeting(uuid(), externalIdentifier)).Meeting
    if (meeting) {
      const attendees = (await ChimeVideo.addAttendeesToMeeting(meeting.MeetingId, meetingAttendees)).Attendees
      attendees ? meeting.attendees = attendees : meeting.attendees = []
    }
    meeting.attendees = meeting.attendees.map(attendee => {
      const userInfo = attendees.find(user => user.ExternalUserId === attendee.ExternalUserId)
      return { ...attendee, ...userInfo }
    })
    return meeting
  },

  /**
   * delete a chime meeting
   * @param {string} meetingId meeting identifier
   */
  async deleteMeeting (meetingId) {
    const result = await ChimeVideo.deleteMeeting(meetingId)
    if (result) return true
  },

  /**
   * Get Chime meeting information
   * @param {string} meetingId meeting identifier
   */
  async getMeeting (meetingId) {
    const result = (await ChimeVideo.getMeeting(meetingId)).Meeting
    return result
  },

  /**
   * Add attendees to a Chime meeting
   * @param {string} meetingId meeting identifier
   * @param {object[]} attendees attendee list
   */
  async addAttendees (meetingId, attendees = []) {
    const existingAttendees = (await this.getAttendees(meetingId)).attendees
    if (existingAttendees.length === 4) {
      throw new Error('Cannot add any further attendees to meeting.')
    }
    const meetingAttendees = attendees.map(attendee => {
      const obj = {
        ExternalUserId: `${uuid().substring(0, 8)}#${attendee.name}`
      }
      attendee.ExternalUserId = obj.ExternalUserId
      return obj
    })
    const result = await ChimeVideo.addAttendeesToMeeting(meetingId, meetingAttendees)
    return result
  },

  /**
   * Get list of attendees in a Chime Meeting
   * @param {string} meetingId meeting identifier
   */
  async getAttendees (meetingId) {
    const result = (await ChimeVideo.getAttendeeList(meetingId)).Attendees
    return {
      meetingId: meetingId,
      attendees: result
    }
  }
}
